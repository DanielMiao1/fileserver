import createSidebar from "../sidebar.js";
import createToolbar from "../toolbar.js";
import { extension } from "../filetype.js";

const main = document.getElementsByTagName("main")[0];

function loadText() {
	const element = document.createElement("pre");
	return element;
}

function loadImage() {
	const image = document.createElement("img");
	image.src = "/raw" + window.path;
	return image;
}

export default function loadFile(data) {
	window.loadStylesheets(["/static/css/file.css"]);

	const format = extension(window.path.split("/").slice(-1)[0]);

	let element;
	if (!format) {
		element = loadText();
	}
	else if (["png", "tiff", "jpg", "jpeg", "webp"].includes(format)) {
		element = loadImage();
	}

	if (!element) {
		element = loadText();
	}

	main.append(element);

	document.getElementById("container").prepend(createSidebar());
	document.body.appendChild(createToolbar(false));
}
