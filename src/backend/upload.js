import { fastifyMultipart } from "@fastify/multipart";

import { pipeline } from "stream";
import { promisify } from "util";

import * as fs from "fs";

const upload = promisify(pipeline);

const serving_directory = process.env.DIRECTORY ?? "/store";

export function registerMultipartHooks(server) {
	server.register(fastifyMultipart, {
		limits: {
			fieldNameSize: 1000000000,
			fieldSize: 1000000000000,
			fileSize: 1000000000000,
			files: 1000000000
		}
	});
}

export function registerUploadHooks(server) {
	server.post("/*", async (request, reply) => {
		const path = serving_directory + request.url;
	
		for await (const part of request.files()) {
			const file_path = `${path}/${part.filename}`;
			
			if (fs.existsSync(file_path)) {
				return reply.status(409).send();
			}
	
			upload(part.file, fs.createWriteStream(file_path));
		}
	
		reply.type("text/html");
		return reply.send("<!DOCTYPE html><html><head><script>history.back();</script></head></html>");
	});
}
