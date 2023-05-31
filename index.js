const fastify = require("fastify");
const static = require("@fastify/static");
const fs = require("fs");
const { join } = require("path");
// const fileUpload = require("express-fileupload");

const serving_directory = process.env.DIRECTORY ?? "/store";

const server = fastify({
	ignoreDuplicateSlashes: true,
	logger: true
});

server.register(static, {
	root: join(process.cwd(), "imgs"),
	prefix: "/static"
});

server.register(static, {
	root: serving_directory,
	prefix: "/download",
	decorateReply: false
});

// server.use(fileUpload({
// 	createParentPath: true
// }));

// server.use("/download", express.static(serving_directory))

server.get("/path/*", async (request, reply) => {
	reply.type("text/html");
	// reply.header("Access-Control-Allow-Origin", "*");
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

	if (fs.statSync(path).isDirectory()) {
		reply.send({
			"type": "directory",
			"data": Object.assign({}, ...fs.readdirSync(path).map(item => ({
				[item]: fs.statSync((path.endsWith("/") ? path : path + "/") + item).isDirectory()
			})))
		});
	} else {
		reply.send({"type": "file", "data": fs.readFileSync(path, "utf8")});
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

server.post("/upload/:path", async (request, reply) => {
	try {
		if (!request.files) {
			reply.send({
				status: false,
				message: "No file selected"
			});
		} else {
			let file = request.files.file;
			file.mv(serving_directory + "/" + (request.params.path.endsWith("/") ? request.params.path : request.params.path + "/") + file.name);
			reply.redirect("/")
		}
	} catch (error) {
		reply.status(500).send(error);
	}
});

server.post("/write", function(request, reply) {
	fs.writeFileSync(serving_directory + request.headers["x-path"], request.body);
	reply.redirect("/");
})

// server.use(function(request, reply) {
// 	reply.status(404);
// 	reply.redirect("/");
// });

const start = async () => {
	try {
		await server.listen({ port: 8192 });
		console.log("Started listening on port 8192");
	} catch (error) {
		server.log.error(error);
		process.exit(1);
	}
};

start();
