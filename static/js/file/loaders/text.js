export default async function load(source, language) {
	if (language) {
		const script = document.createElement("script");
		script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js";
		script.integrity = "sha512-rdhY3cbXURo13l/WU9VlaRyaIYeJ/KBakckXIvJNAQde8DgpOmE+eZf7ha4vdqVjTtwQt69bD2wH2LXob/LB7Q==";
		script.crossOrigin = "anonymous";
		document.body.appendChild(script);
	}
	
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
	text.appendChild(code)

	return text;
}
