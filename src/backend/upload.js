import * as fs from "fs";

const serving_directory = process.env.DIRECTORY ?? "/store";

function fileNameAndExtension(path) {
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

function assignDeduplicateFilename(path) {
	let deduplicated_path = path;

	while (fs.existsSync(deduplicated_path)) {
		const [filename, extension] = fileNameAndExtension(deduplicated_path);
		if (filename.endsWith(" copy")) {
			deduplicated_path = `${filename} 1${extension}`;
		} else if (/ copy \d+$/u.test(filename)) {
			const copy_index = filename.lastIndexOf(" ") + 1;
			const new_digit = parseInt(filename.slice(copy_index), 10) + 1;
			deduplicated_path = filename.slice(0, copy_index) + new_digit + extension;
		} else {
			deduplicated_path = `${filename} copy${extension}`;
		}
	}

	return deduplicated_path;
}

export function registerUploadHooks(server) {
	server.post("/*", async (request, reply) => {
		const path = assignDeduplicateFilename(serving_directory + decodeURIComponent(request.url));
	
		fs.writeFileSync(path, request.body, {
			flag: "w"
		}, error => {
			if (error) {
				server.log.error(error);
			}
		});
	
		reply.type("text/html").send();
	});
}
