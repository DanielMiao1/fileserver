import { default as fs } from "fs"
import { join } from "path";

export default function registerFrontendHooks(server) {
	server.get("/", (_, reply) => {
		reply.redirect("/path/");
	});

	server.get("/path", (_, reply) => {
		reply.redirect("/path/");
	});

	server.get("/path/*", (_, reply) => {
		reply.type("text/html");
		return fs.readFileSync(join(process.cwd(), "src/frontend/index.html"));
	});

	server.get("/favicon.ico", (_, reply) => {
		reply.redirect("/static/favicon.ico");
	});

	server.get("*", (request, reply) => {
		reply.redirect(`/path${request.url}`);
	});
}
