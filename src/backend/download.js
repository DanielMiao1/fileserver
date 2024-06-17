import { execSync } from "child_process";
import { join } from "path";

import * as fs from "fs";

const serving_directory = process.env.DIRECTORY ?? "/store";

function getFileContents(path) {
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


export function registerDownloadHooks(server) {
	server.get("/download/*", (request, reply) => {
		const path = serving_directory + decodeURIComponent(request.url.slice(9));
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

		execSync(`zip -r ${zip_path} ${filename}/*`, {
			cwd: join(path, "..")
		});
		
		return reply.status(299).send(getFileContents(zip_path).contents);
	});
}
