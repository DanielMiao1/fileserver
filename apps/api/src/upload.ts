import { existsSync, mkdirSync, writeFileSync } from "fs";

import { getScopedPath } from "./path";

import type { FastifyInstance } from "fastify";

function fileNameAndExtension(path: string): [string, string] {
	const dot_index = path.lastIndexOf(".");
	const slash_index = path.lastIndexOf("/");

	if (dot_index === -1) {
		return [path, ""];
	}

	if (slash_index !== -1 && dot_index < slash_index) {
		return [path, ""];
	}

	return [path.slice(0, dot_index), path.slice(dot_index)];
}

function assignDeduplicateFilename(path: string) {
	let deduplicated_path = path;

	while (existsSync(deduplicated_path)) {
		const [filename, extension] = fileNameAndExtension(deduplicated_path);
		if (filename.endsWith(" copy")) {
			deduplicated_path = `${filename} 1${extension}`;
		} else if ((/ copy \d+$/u).test(filename)) {
			const copy_index = filename.lastIndexOf(" ") + 1;
			const new_digit = parseInt(filename.slice(copy_index), 10) + 1;

			const original_filename = filename.slice(0, copy_index);
			const new_filename = original_filename + new_digit.toString();
			deduplicated_path = new_filename + extension;
		} else {
			deduplicated_path = `${filename} copy${extension}`;
		}
	}

	return deduplicated_path;
}

export default function registerUploadHooks(server: FastifyInstance) {
	server.post("/*", (request, reply) => {
		const scoped_path = getScopedPath(decodeURIComponent(request.url));
		if (!scoped_path) {
			return reply.status(400).send();
		}

		const path = assignDeduplicateFilename(scoped_path);

		if (!path) {
			return reply.status(400).send();
		}

		if (request.headers.type === "file") {
			const file_contents = request.body as string;

			writeFileSync(path, file_contents, {
				flag: "w"
			});
		} else if (request.headers.type === "directory") {
			mkdirSync(path);
		} else {
			return reply.status(415).send();
		}

		return reply.type("text/html").send();
	});
}
