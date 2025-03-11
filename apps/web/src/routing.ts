function alphanumSeqToInt(seq: string): number {
	/**
	 * Converts base-62 to base-10
	 * a = 0, A = 26, 0 = 52, 9 = 61
	 * ba = 62
	 */

	let num = 0;

	for (let index = seq.length - 1; index >= 0; index--) {
		const code_point = seq.codePointAt(index) ?? 0;
		let digit = 0;

		if (code_point >= 65 && code_point <= 90) {
			digit = code_point - 39;
		} else if (code_point >= 97 && code_point <= 122) {
			digit = code_point - 97;
		} else {
			digit = code_point + 4;
		}

		const multiplier = 62 ** (seq.length - index - 1);

		num += multiplier * digit;
	}

	return num;
}

function alphanumSeqFromInt(num: number): string {
	let sequence = "";

	while (num > 0) {
		const digit = num % 62;
		let code_point = 0;

		if (digit <= 25) {
			code_point = digit + 97;
		} else if (digit <= 51) {
			code_point = digit + 39;
		} else {
			code_point = digit - 4
		}

		sequence = String.fromCodePoint(code_point) + sequence;

		num = Math.floor(num / 62);
	}

	return sequence;
}

function alphanumEncode(data: string): string {
	let encoded_data = "";
  
  [...data].forEach(character => {
		const code_point = character.codePointAt(0) ?? 0;
		const alphanum_seq = alphanumSeqFromInt(code_point);

		encoded_data += alphanum_seq.length + alphanum_seq;
	});

	return encoded_data;
}

function alphanumDecode(data: string): string {
	let decoded_data = "";

	let reading = "";
	let stop_reading = 0;

	for (let index = 0; index < data.length; index++) {
		const character = data.charAt(index);

		if (index === stop_reading) {
			if (reading) {
				decoded_data += String.fromCodePoint(alphanumSeqToInt(reading));
			}

			reading = "";
		
			stop_reading = index + parseInt(character) + 1;
			continue;
		}

		reading += character;
	}

	decoded_data += String.fromCodePoint(alphanumSeqToInt(reading));

	return decoded_data;
}

let route = "/";

function redirect(path: string) {
	document.location.hash = `#${alphanumEncode(path)}`;
	route = path;
}

if (!document.location.hash) {
	redirect("/");
}

const hash = document.location.hash.slice(1);

route = alphanumDecode(hash);

export default route;
