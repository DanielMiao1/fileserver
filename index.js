const fastify = require("fastify");
const static = require("@fastify/static");
const fs = require("fs");
const { join } = require("path");
const { execSync } = require("child_process");

const pipeline = require("util").promisify(require("stream").pipeline);

const serving_directory = process.env.DIRECTORY ?? "/store";

const server = fastify({
	ignoreDuplicateSlashes: true,
	logger: true
});

server.register(require("@fastify/multipart"), {
	limits: {
		fieldNameSize: 1000000000,
		fieldSize: 1000000000000,
		fileSize: 1000000000000,
		files: 1000000000
	}
});

server.register(require("@fastify/compress"), {
	threshold: 512,
	zlibOptions: {
		level: 9
	}
});

server.register(static, {
	root: join(process.cwd(), "static"),
	prefix: "/static"
});

server.register(static, {
	setHeaders: (response, path) => {
		response.setHeader("Content-Disposition", `attachment; filename="${path.slice(path.lastIndexOf("/") + 1)}"`);
		response.setHeader("Cache-Control", "no-store");
	},
	root: serving_directory,
	prefix: "/raw",
	decorateReply: false
});

server.get("/path/*", async (request, reply) => {
	reply.type("text/html");
	return fs.readFileSync(join(process.cwd(), "index.html"));
});

server.get("/path", function(request, reply) {
	reply.redirect("/path/");
});

server.get("/", function(request, reply) {
	reply.redirect("/path/");
});

server.get("/data/*", function(request, reply) {
	reply.header("Cache-Control", "no-store");
	const path = serving_directory + request.url.slice(5);

	if (!fs.existsSync(path)) {
		reply.status(404).send();
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
			encoding: stat.size <= 2000000 && execSync("uchardet " + path).toString().slice(0, -1)
		});
	};
});

server.get("/rename/:from/:to", function(request, reply) {
	fs.renameSync(serving_directory + request.params.from, serving_directory + request.params.to);
	reply.redirect("/");
});

server.get("/delete/:path", function(request, reply) {
	fs.unlinkSync(serving_directory + request.params.path);
	reply.redirect("/");
});

server.get("/deletedir/:path", function(request, reply) {
	fs.rmSync(serving_directory + request.params.path, { recursive: true, force: true });
	reply.redirect("/");
});

server.get("/newdir/:path", function(request, reply) {
	fs.mkdirSync(serving_directory + request.params.path);
	reply.redirect("/");
});

server.get("/newfile/:path", function(request, reply) {
	fs.writeFileSync(serving_directory + request.params.path, "");
	reply.redirect("/");
});

server.post("/write/*", async function(request, reply) {
	const path = serving_directory + request.url.slice(6);
		
	for await (const part of request.files()) {
		console.log(part.filename);
		if (fs.existsSync(path + part.filename)) {
			return reply.status(409).send();
		}

		pipeline(part.file, fs.createWriteStream(path + part.filename));
	}

	reply.type("text/html");
	return reply.send("<!DOCTYPE html><html><head><script>history.back();</script></head></html>");
})

// server.use(function(request, reply) {
// 	reply.status(404);
// 	reply.redirect("/");
// });

const start = async () => {
	try {
		await server.listen({ port: 8192, host: "0.0.0.0" });
		console.log("Started listening on port 8192");
	} catch (error) {
		server.log.error(error);
		process.exit(1);
	}
};

start();
