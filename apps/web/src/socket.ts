const VERSION = "\u0001";

const socket = new WebSocket(`ws://${location.host}`);

let request_index = 0;

type response_callback = (data: string) => void;

const response_callbacks: Record<number, response_callback> = {};

socket.addEventListener("error", error => {
	console.error(error);
});

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

async function listDirectory(path: string) {
	const data = await send("\u0000", path);
	const items = {};

	let reading = "";
	let stop_reading = 0;

	let is_file = false;

	for (let index = 0; index < data.length; index++) {
		const character = data.charAt(index);
		
		if (index === stop_reading) {
			stop_reading = index + character.charCodeAt(0) + 1;
			index++;

			is_file = !!data.charCodeAt(index);

			if (reading) {
				items[reading] = is_file;
			}

			reading = "";
			continue;
		}

		reading += character;
	}

	return items;
}

export {
	listDirectory
};
