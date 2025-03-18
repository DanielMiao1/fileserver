const VERSION = "\u0002";

const socket = new WebSocket(`ws://${location.host}`);

let request_index = 0;

socket.addEventListener("error", error => {
	console.error(error);
});

type response_callback = (data: string) => void;
const response_callbacks: Record<number, response_callback> = {};

socket.addEventListener("message", data => {
	const response = data.data as string;
	const index = response.charCodeAt(0) % 0x10000;

	if (index in response_callbacks) {
		response_callbacks[index](response.slice(1));
	}
});

const ready = new Promise<void>(resolve => {
	socket.addEventListener("open", () => {
		resolve();
	});
});

async function send(method: string, data: string): Promise<string> {
	const index = request_index;
	const request = VERSION + String.fromCodePoint(index) + method + data;
	request_index++;
	
	if (request_index > 0xffff) {
		request_index = 0;
	}

	ready.then(() => {
		socket.send(request);
	});

	return new Promise(resolve => {
		response_callbacks[index] = resolve;
	});
}

async function isFile(path: string) {
	const data = await send("\u0001", path);

	return !!data.codePointAt(0);
}

type directory_items = Record<string, boolean>;

async function listDirectory(path: string): Promise<directory_items> {
	const data = await send("\u0002", path);
	const items = {};

	let index = 0;

	while (index < data.length) {
		const character = data.charAt(index);

		const end = index + character.charCodeAt(0) + 1;
		const is_file = !!data.charCodeAt(index + 1);

		items[data.slice(index + 2, end)] = is_file;
		index = end;
	}

	return items;
}

export {
	isFile,
	listDirectory
};

export type {
	directory_items
};
