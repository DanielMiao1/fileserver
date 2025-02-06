import fastify from "fastify";
import fastifyCompress from "@fastify/compress";
import fastifyStatic from "@fastify/static";
import fastifyWebsocket from "@fastify/websocket";

import { resolve } from "path";
import { readFileSync } from "fs";

import parseMessage from "./socket";

const server = fastify({
	ignoreDuplicateSlashes: true,
	logger: true
});

server.register(fastifyCompress, {
	threshold: 512,
	zlibOptions: {
		level: 9
	}
});

server.register(fastifyStatic, {
	decorateReply: false,
	prefix: "/",
	root: resolve(process.cwd(), "dist/web")
})

server.register(fastifyWebsocket);

server.register(async () => {
	server.route({
		method: "GET",
		url: "/",
		handler: (_, reply) => {
			reply.type("text/html");
			return readFileSync(resolve(process.cwd(), "dist/web/index.html"))
		},
		wsHandler: socket => {
			socket.on("message", message => {
				const array = new Uint8Array(message as Buffer);
				const data = parseMessage(array);

				console.log(data);
			})
		}
	});
});

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
