import fastify from "fastify";
import fastifyCompress from "@fastify/compress";
import fastifyStatic from "@fastify/static";
import fastifyWebsocket from "@fastify/websocket";

import { resolve } from "path";
import { readFileSync } from "fs";

import { trailingSlash, listDirectory } from "./fs";

const VERSION = "\u0001";

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

function handleWSMessage(message: string) {
	switch (message[0]) {
		case ("\u0000"):
			return listDirectory(trailingSlash(message.slice(1)));
	}
}

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
				const data = message.toString();

				if (data[0] !== VERSION) {
					return socket.send("\u{10000}" + VERSION);
				}

				const request_index = data.codePointAt(1) ?? 0;

				const response = handleWSMessage(data.slice(2));

				socket.send(String.fromCodePoint(request_index) + response);
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
