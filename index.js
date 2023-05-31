const fastify = require("fastify");
const static = require("@fastify/static");
const fs = require("fs");
const { join } = require("path");
// const fileUpload = require("express-fileupload");

const directory_root = process.env.DIRECTORY ?? "/store";

const server = fastify({
	ignoreDuplicateSlashes: true,
	logger: true
});

server.register(static, {
	root: join(process.cwd(), "imgs"),
	prefix: "/static"
});

server.register(static, {
	root: directory_root,
	prefix: "/download",
	decorateReply: false
});

// server.use(fileUpload({
// 	createParentPath: true
// }));

// server.use("/download", express.static(directory_root))

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

server.get("/actions/rename/:from/:to", function(request, reply) {
	fs.renameSync(directory_root + request.params.from, directory_root + request.params.to);
	reply.redirect("/");
});

server.get("/actions/delete/:path", function(request, reply) {
	fs.unlinkSync(directory_root + request.params.path);
	reply.redirect("/");
});

server.get("/actions/deletedir/:path", function(request, reply) {
	fs.rmSync(directory_root + request.params.path, { recursive: true, force: true });
	reply.redirect("/");
});

server.get("/actions/newdir/:path", function(request, reply) {
	fs.mkdirSync(directory_root + request.params.path);
	reply.redirect("/");
});

server.get("/actions/newfile/:path", function(request, reply) {
	fs.writeFileSync(directory_root + request.params.path, "");
	reply.redirect("/");
});

server.post("/actions/upload/:path", async (request, reply) => {
	try {
		if (!request.files) {
			reply.send({
				status: false,
				message: "No file selected"
			});
		} else {
			let file = request.files.file;
			file.mv(directory_root + "/" + (request.params.path.endsWith("/") ? request.params.path : request.params.path + "/") + file.name);
			reply.redirect("/")
		}
	} catch (error) {
		reply.status(500).send(error);
	}
});

server.post("/actions/write", function(request, reply) {
	fs.writeFileSync(directory_root + request.headers["x-path"], request.body);
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
