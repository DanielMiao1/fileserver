import { fastify } from "fastify";
import { fastifyStatic } from "@fastify/static";
import { fastifyCompress } from "@fastify/compress";

import { join } from "path";
import { default as fs } from "fs"
import { spawnSync } from "child_process";

import { upload, registerMultipartHooks } from "./upload.js";
import registerFrontendHooks from "./frontend.js";

const serving_directory = process.env.DIRECTORY ?? "/store";

const server = fastify({
	ignoreDuplicateSlashes: true,
	// logger: true
});

registerMultipartHooks(server);

server.register(fastifyCompress, {
	threshold: 512,
	zlibOptions: {
		level: 9
	}
});

server.register(fastifyStatic, {
	root: join(process.cwd(), "src/frontend"),
	prefix: "/static"
});

server.register(fastifyStatic, {
	setHeaders: (response, path) => {
		response.setHeader("Content-Disposition", `attachment; filename="${path.slice(path.lastIndexOf("/") + 1)}"`);
		response.setHeader("Cache-Control", "no-store");
	},
	root: serving_directory,
	prefix: "/download",
	decorateReply: false
});

server.register(fastifyStatic, {
	setHeaders: (response) => {
		response.setHeader("Cache-Control", "no-store");
	},
	root: serving_directory,
	prefix: "/raw",
	decorateReply: false
});

registerFrontendHooks(server);

server.get("/data/*", async (request, reply) => {
	reply.header("Cache-Control", "no-store");
	const path = serving_directory + decodeURIComponent(request.url.slice(5));

	if (!fs.existsSync(path)) {
		return reply.status(404).send();
	}

	const stat = fs.statSync(path)

	if (stat.isDirectory()) {
		reply.send({
			type: "directory",
			data: Object.assign({}, ...fs.readdirSync(path).map(item => ({
				[item]: fs.statSync((path.endsWith("/") ? path : path + "/") + item).isDirectory()
			})))
		});
	} else {
		reply.send({
			type: "file",
			size: stat.size,
			encoding: stat.size <= 2000000 && spawnSync("uchardet", [path]).stdout.toString().slice(0, -1)
		});
	};
});

server.delete("/*", async (request, reply) => {
	const path = (
		serving_directory + "/"
		+ decodeURIComponent(request.url).slice(6)
	);
	
	if (fs.statSync(path).isDirectory()) {
		fs.rmSync(path, { recursive: true, force: true });
	} else {
		fs.unlinkSync(path);
	}

	reply.send();
});

// server.get("/rename/:from/:to", async (request, reply) => {
// 	fs.renameSync(serving_directory + request.params.from, serving_directory + request.params.to);
// 	reply.redirect("/");
// });

// server.get("/newdir/:path", async (request, reply) => {
// 	fs.mkdirSync(serving_directory + request.params.path);
// 	reply.redirect("/");
// });

// server.get("/newfile/:path", async (request, reply) => {
// 	fs.writeFileSync(serving_directory + request.params.path, "");
// 	reply.redirect("/");
// });

server.post("/*", async (request, reply) => {
	const path = serving_directory + request.url.slice(6);

	for await (const part of request.files()) {
		const file_path = `${path}/${part.filename}`;
		
		if (fs.existsSync(file_path)) {
			return reply.status(409).send();
		}

		upload(part.file, fs.createWriteStream(file_path));
	}

	reply.type("text/html");
	return reply.send("<!DOCTYPE html><html><head><script>history.back();</script></head></html>");
});

server.get("*", async (request, reply) => {
	reply.redirect("/path" + request.url);
});

const start = async () => {
	try {
		await server.listen({
			port: 8192,
			host: "0.0.0.0"
		});

		console.log("Started listening on port 8192");
	} catch (error) {
		server.log.error(error);
		process.exit(1);
	}
};

start();
