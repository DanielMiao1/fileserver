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

server.register(require("@fastify/multipart"));

server.register(static, {
	root: join(process.cwd(), "static"),
	prefix: "/static"
});

server.register(static, {
	root: serving_directory,
	prefix: "/download",
	decorateReply: false
});

server.get("/path/*", async (request, reply) => {
	reply.type("text/html");
	reply.header("Cache-Control", "no-store");
	return fs.readFileSync(join(process.cwd(), "index.html"));
});

server.get("/path", function(request, reply) {
	reply.redirect("/path/");
});

server.get("/", function(request, reply) {
	reply.redirect("/path/");
});

server.get("/raw/*", function(request, reply) {
	reply.header("Cache-Control", "no-store");
	const path = serving_directory + request.url.slice(4);

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
			encoding: stat.size <= 2000000 && execSync("uchardet " + path).toString().slice(0, -1),
			data: fs.readFileSync(path, "utf8")
		});
	};
})

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
	
	if (fs.existsSync(path)) {
		return reply.status(409).send();
	}

	for await (const part of request.parts()) {
		if (part.file) {
			await pipeline(part.file, fs.createWriteStream(serving_directory + "/" + part.filename));
		}
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
