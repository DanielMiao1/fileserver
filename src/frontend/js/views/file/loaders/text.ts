import hljs from "highlight.js";

export default async function load(
	source: string,
	language?: string
): Promise<HTMLPreElement> {
	import("../../../../css/file/loaders/text.scss").catch((error: unknown) => {
		console.error(error);
		throw new Error("Failed to load css file");
	});

	const data = await (await fetch(source)).text();
	const text = document.createElement("pre");

	const numbers = document.createElement("div");
	for (let index = 0; index < data.split("\n").length; index++) {
		const number = document.createElement("p");
		number.textContent = (index + 1).toString();
		numbers.appendChild(number);
	}
	text.appendChild(numbers);

	const code = document.createElement("code");
	code.innerText = data;

	if (language) {
		code.classList.add(`language-${language}`);
		hljs.highlightElement(code);
	}

	text.appendChild(code);

	return text;
}
