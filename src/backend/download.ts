import { execSync } from "child_process";
import { join } from "path";

import * as fs from "fs";

import getScopedPath from "./path.js";

import type { FastifyInstance } from "fastify";

function getFileContents(path: string) {
	if (fs.existsSync(path)) {
		const stat = fs.statSync(path)

		if (stat.isDirectory()) {
			return { isFile: false };
		}

		return {
			contents: fs.readFileSync(path),
			isFile: true
		};
	}

	return {};
}

export function initializeTmp() {
	if (fs.existsSync("tmp")) {
		fs.rmSync("tmp", {
			force: true,
			recursive: true
		});
	}

	fs.mkdirSync("tmp");
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

		execSync(`zip ${zip_path} -r ${filename}`, {
			cwd: join(path, "..")
		});
		
		reply.status(299).send(getFileContents(zip_path).contents);

		return fs.rmSync(zip_path);
	});
}
