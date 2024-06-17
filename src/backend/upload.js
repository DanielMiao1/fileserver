import { pipeline } from "stream";
import { promisify } from "util";

import { fastifyMultipart } from "@fastify/multipart";

export const upload = promisify(pipeline);

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
