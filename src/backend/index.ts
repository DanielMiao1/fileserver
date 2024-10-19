import { fastify } from "fastify";
import { fastifyCompress } from "@fastify/compress";
import { fastifyStatic } from "@fastify/static";

import {
	existsSync,
	readdirSync,
	renameSync,
	rmSync,
	statSync,
	unlinkSync
} from "fs";

import { join } from "path";
import { spawnSync } from "child_process";

import registerFrontendHooks from "./frontend.js";
import registerUploadHooks from "./upload.js";

import { getScopedPath, serving_directory } from "./path.js";
import { initializeTmp, registerDownloadHooks } from "./download.js";
import { uchardetAvailable } from "./check_dependencies.js";

const uchardet_available = uchardetAvailable();

initializeTmp();

const server = fastify({
	ignoreDuplicateSlashes: true,
	logger: process.env["NODE_ENV"] !== "production"
});

if (!uchardet_available) {
	server.log.error("The `uchardet' command was not found on this system.");
}

if (!existsSync(serving_directory)) {
	throw new Error("Invalid serving directory");
}

server.register(fastifyCompress, {
	threshold: 512,
	zlibOptions: {
		level: 9
	}
});

server.register(fastifyStatic, {
	prefix: "/static",
	root: join(process.cwd(), "build/frontend")
});

server.register(fastifyStatic, {
	decorateReply: false,
	prefix: "/raw",
	root: serving_directory,
	setHeaders: response => {
		response.setHeader("Cache-Control", "no-store");
	}
});

registerDownloadHooks(server);

function getEncoding(path: string, size: number) {
	if (size > 2000000) {
		return "";
	}

	if (!uchardet_available) {
		return "Unknown";
	}

	return spawnSync("uchardet", [path]).stdout.toString().slice(0, -1);
}

server.get("/data/*", (request, reply) => {
	reply.header("Cache-Control", "no-store");
	const path = getScopedPath(decodeURIComponent(request.url.slice(5)), true);

	if (path && existsSync(path)) {
		const stat = statSync(path);

		if (stat.isDirectory()) {
			const contents: Record<string, boolean> = {};

			for (const item of readdirSync(path)) {
				const item_path = (path.endsWith("/") ? path : `${path}/`) + item;
				const item_stat = statSync(item_path);
				contents[item] = item_stat.isDirectory();
			}

			reply.send({
				data: contents,
				type: "directory"
			});
		} else {
			reply.send({
				encoding: getEncoding(path, stat.size),
				size: stat.size,
				type: "file"
			});
		}
	} else {
		reply.status(404).send();
	}
});

server.delete("/*", (request, reply) => {
	const path = getScopedPath(decodeURIComponent(request.url));

	if (!path) {
		return reply.status(400).send();
	}

	if (!existsSync(path)) {
		return reply.status(404).send();
	}

	if (statSync(path).isDirectory()) {
		rmSync(path, {
			force: true,
			recursive: true
		});
	} else {
		unlinkSync(path);
	}

	return reply.send();
});

registerUploadHooks(server);

server.put("/*", (request, reply) => {
	if (typeof request.headers["path"] !== "string") {
		return reply.status(400).send();
	}

	const new_path = getScopedPath(decodeURIComponent(request.url));
	const old_path = getScopedPath(request.headers["path"]);

	if (!new_path || !old_path) {
		return reply.status(400).send();
	}

	if (!existsSync(old_path)) {
		return reply.status(404).send();
	}

	if (existsSync(new_path)) {
		return reply.status(409).send();
	}

	renameSync(old_path, new_path);

	return reply.send();
});

registerFrontendHooks(server);

const start = async () => {
	try {
		await server.listen({
			host: "0.0.0.0",
			port: 8192
		});
	} catch (error) {
		server.log.error(error);
		throw new Error("Failed to start server");
	}
};

await start();
