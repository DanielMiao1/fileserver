const VERSION = "10000001";

const socket = new WebSocket("ws://127.0.0.1:8192/");

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

socket.binaryType = "arraybuffer";

function encodePath(path: string): string {
	/*
	 * [5 bits for code length] [code]
	 * max code is of 21 bits long
	 */

	let sequence = "";

	for (let index = 0; index < path.length; index++) {
		const code = path.codePointAt(index) ?? 0;
		const length = code.toString(2).length;

		sequence += length.toString(2).padStart(5, "0") + code.toString(2);
	}

	return sequence;
}

function dataToTypedArray(data: string): Uint8Array {
	/*
	 * Each 8-bit segment is converted into uint8 number
	 * Zeros are padded to the final segment to make 8 bits,
	 * and number of zeros padded is stored in final number
	 */
	const array: number[] = [];

	const length = data.length;
	const segments = Math.floor(length / 8);
	const remainder = length % 8;

	for (let segment = 0; segment < segments; segment++) {
		const start = segment * 8;
		const end = (segment + 1) * 8;

		const substring = data.slice(start, end);
		array.push(parseInt(substring, 2));
	}

	const final_segment_start = segments * 8;
	const final_segment = data.slice(final_segment_start, length);
	array.push(parseInt(final_segment.padEnd(8, "0"), 2));

	const fill = 8 - remainder;
	array.push(fill);

	return new Uint8Array(array);
}

async function send(data: string) {
	const array = dataToTypedArray(data);

	ready.then(() => {
		socket.send(array);
	});
}

async function listDirectory(path: string) {
	send(`0002${encodePath(path)}`);
}

export { listDirectory };
