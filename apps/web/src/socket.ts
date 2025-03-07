const VERSION = "\u0001";

const socket = new WebSocket(`ws://${location.host}`);

socket.addEventListener("error", error => {
	console.error(error);
});

socket.addEventListener("message", data => {
	console.log(data);
});

const ready = new Promise<void>(resolve => {
	socket.addEventListener("open", () => {
		resolve();
	});
});

async function send(method: string, data: string) {
	const request = VERSION + method + data;

	ready.then(() => {
		socket.send(request);
	});
}

async function listDirectory(path: string) {
	send("\u0000", path);
}

export {
	listDirectory
};
