import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from "fs";
import { execFileSync } from "child_process";
import { join } from "path";

import { getScopedPath } from "./path.js";

import type { FastifyInstance } from "fastify";

function getFileContents(path: string) {
	if (existsSync(path)) {
		const stat = statSync(path);

		if (stat.isDirectory()) {
			return { isFile: false };
		}

		return {
			contents: readFileSync(path),
			isFile: true
		};
	}

	return {};
}

export function initializeTmp() {
	if (existsSync("tmp")) {
		rmSync("tmp", {
			force: true,
			recursive: true
		});
	}

	mkdirSync("tmp");
}


export function registerDownloadHooks(server: FastifyInstance) {
	server.get("/download/*", (request, reply) => {
		const path = getScopedPath(decodeURIComponent(request.url.slice(9)), true);

		if (!path) {
			return reply.status(400).send();
		}

		const filename = path.slice(path.lastIndexOf("/") + 1);

		reply.header("Cache-Control", "no-store");

		const data = getFileContents(path);

		if (!Object.keys(data).length) {
			return reply.status(404).send();
		}

		if (data.isFile) {
			reply.header("Content-Disposition", `attachment; filename="${filename}"`);
			return reply.send(data.contents);
		}

		reply.header("Content-Disposition", `attachment; filename="${filename}.zip"`);

		const zip_path = `${process.cwd()}/tmp/${filename}.zip`;

		execFileSync("zip", [zip_path, "-r", filename], {
			cwd: join(path, "..")
		});

		const zip_content = getFileContents(zip_path).contents;

		rmSync(zip_path);
		return reply.status(299).send(zip_content);
	});
}
