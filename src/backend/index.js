import { fastify } from "fastify";
import { fastifyCompress } from "@fastify/compress";
import { fastifyStatic } from "@fastify/static";

import { default as fs } from "fs"
import { join } from "path";
import { spawnSync } from "child_process";

import { registerMultipartHooks, upload } from "./upload.js";
import registerFrontendHooks from "./frontend.js";

const serving_directory = process.env.DIRECTORY ?? "/store";

const server = fastify({
	ignoreDuplicateSlashes: true,
	logger: process.env.NODE_ENV !== "production"
});

registerMultipartHooks(server);

server.register(fastifyCompress, {
	threshold: 512,
	zlibOptions: {
		level: 9
	}
});

server.register(fastifyStatic, {
	prefix: "/static",
	root: join(process.cwd(), "src/frontend")
});

server.register(fastifyStatic, {
	decorateReply: false,
	prefix: "/download",
	root: serving_directory,
	setHeaders: (response, path) => {
		response.setHeader("Content-Disposition", `attachment; filename="${path.slice(path.lastIndexOf("/") + 1)}"`);
		response.setHeader("Cache-Control", "no-store");
	}
});

server.register(fastifyStatic, {
	decorateReply: false,
	prefix: "/raw",
	root: serving_directory,
	setHeaders: (response) => {
		response.setHeader("Cache-Control", "no-store");
	}
});

registerFrontendHooks(server);

server.get("/data/*", (request, reply) => {
	reply.header("Cache-Control", "no-store");
	const path = serving_directory + decodeURIComponent(request.url.slice(5));

	if (fs.existsSync(path)) {
		const stat = fs.statSync(path)

		if (stat.isDirectory()) {
			reply.send({
				data: Object.assign({}, ...fs.readdirSync(path).map(item => ({
					[item]: fs.statSync((path.endsWith("/") ? path : `${path}/`) + item).isDirectory()
				}))),
				type: "directory"
			});
		} else {
			reply.send({
				encoding: stat.size <= 2000000 && spawnSync("uchardet", [path]).stdout.toString().slice(0, -1),
				size: stat.size,
				type: "file"
			});
		};
	} else {
		reply.status(404).send();
	}
});

server.delete("/*", (request, reply) => {
	const path = `${serving_directory}/${decodeURIComponent(request.url).slice(6)}`

	if (fs.statSync(path).isDirectory()) {
		fs.rmSync(path, {
			force: true,
			recursive: true
		});
	} else {
		fs.unlinkSync(path);
	}

	reply.send();
});

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

server.get("*", (request, reply) => {
	reply.redirect(`/path${request.url}`);
});

const start = async () => {
	try {
		await server.listen({
			host: "0.0.0.0",
			port: 8192
		});

		server.log.info("Started listening on port 8192");
	} catch (error) {
		server.log.error(error);
		process.exit(1);
	}
};

start();