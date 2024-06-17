async function createElements(source, language) {
	window.loadStylesheets(["/static/css/file/loaders/text.css"]);

	const data = await (await fetch(source)).text();
	const text = document.createElement("pre");
	
	const numbers = document.createElement("div");
	for (let index = 0; index < data.split("\n").length; index++) {
		const number = document.createElement("p");
		number.innerText = index + 1;
		numbers.appendChild(number);
	}
	text.appendChild(numbers);

	const code = document.createElement("code");
	if (language) {
		code.innerHTML = hljs.highlight(data, { language }).value;
	} else {
		code.innerText = data;
	}
	text.appendChild(code);

	return text;
}

export default async function load(source, language) {
	if (language) {
		const script = document.createElement("script");
		script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js";
		script.integrity = "sha512-D9gUyxqja7hBtkWpPWGt9wfbfaMGVt9gnyCvYa+jojwwPHLCzUm5i8rpk7vD7wNee9bA35eYIjobYPaQuKS1MQ==";
		script.crossOrigin = "anonymous";
		document.body.appendChild(script);

		return new Promise(resolve => {
			script.addEventListener("load", async () => {
				resolve(await createElements(source, language));
			});
		});
	}
	
	return await createElements(source, language);
}
