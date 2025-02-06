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

function padZeroEnd(data: string, length: number): string {
	return data.padEnd(length, "0");
}

function padZeroStart(data: string, length: number): string {
	return data.padStart(length, "0");
}

function justifyToByte(data: string): string {
	const length = data.length;
	const fill_amount = 8 - (length % 8);
	const segments = Math.floor(length / 8);
	const fill_to = (segments + 1) * 8;

	return padZeroEnd(data, fill_to) + padZeroStart(fill_amount.toString(2), 8);
}

function asciiEncode(binary: string): string {
	/*
	 * Every 4 bits is converted to an alphabet character
	 * Expects half-byte-justified input
	 */

	let result = "";

	const length = binary.length;
	const segments = Math.floor(length / 4);

	for (let index = 0; index < segments; index++) {
		const start = index * 4;
		const end = (index + 1) * 4;

		const value = parseInt(binary.slice(start, end), 2);
		result += String.fromCodePoint(value + 97); // 0b0000 equals character a
	}
	
	return result;
}

function asciiDecode(ascii: string): string {
	let result = "";

	for (let index = 0; index < ascii.length; index++) {
		const code = ascii.codePointAt(index) ?? 97;
		const value = code - 97;

		result += padZeroStart(value.toString(2), 4);
	}

	return result;
}

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

function asciiPath(path: string): string {
	return asciiEncode(encodePath(path));
}

function dataToTypedArray(data: string): Uint8Array {
	/*
	 * Each 8-bit segment is converted into uint8 number
	 * Zeros are padded to the final segment to make 8 bits,
	 * and number of zeros padded is stored in final number
	 */
	const array: number[] = [];

	const justified_data = justifyToByte(data);

	const length = justified_data.length;
	const segments = Math.floor(length / 8);

	for (let segment = 0; segment < segments; segment++) {
		const start = segment * 8;
		const end = (segment + 1) * 8;

		const substring = justified_data.slice(start, end);
		array.push(parseInt(substring, 2));
	}

	return new Uint8Array(array);
}

async function send(data: string) {
	const array = dataToTypedArray(data);

	ready.then(() => {
		socket.send(array);
	});
}

async function listDirectory(path: string) {
	const METHOD = "10000010";
	const options = encodePath(path);

	send(METHOD + options);
}

export {
	asciiEncode,
	asciiDecode,
	asciiPath,
	listDirectory
};
