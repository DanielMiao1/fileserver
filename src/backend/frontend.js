import { join } from "path";
import { default as fs } from "fs"

export default function registerFrontendHooks(server) {
	server.get("/", async (_, reply) => {
		reply.redirect("/path/");
	});

	server.get("/path", async (_, reply) => {
		reply.redirect("/path/");
	});

	server.get("/path/*", async (_, reply) => {
		reply.type("text/html");
		return fs.readFileSync(join(process.cwd(), "src/frontend/index.html"));
	});

	server.get("/favicon.ico", async (_, reply) => {
		reply.redirect("/static/favicon.ico");
	});
}
