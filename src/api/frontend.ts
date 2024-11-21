import { join } from "path";
import { readFileSync } from "fs";

import type { FastifyInstance } from "fastify";

export default function registerFrontendHooks(server: FastifyInstance) {
	server.get("/", (_, reply) => {
		reply.redirect("/path/");
	});

	server.get("/path", (_, reply) => {
		reply.redirect("/path/");
	});

	server.get("/path/*", (_, reply) => {
		reply.type("text/html");
		return readFileSync(join(process.cwd(), "build/frontend/index.html"));
	});

	server.get("/favicon.ico", (_, reply) => {
		reply.redirect("/static/favicon.ico");
	});

	server.get("*", (request, reply) => {
		reply.redirect(`/path${request.url}`);
	});
}
