import createSidebar from "../sidebar.js";
import createToolbar from "../toolbar.js";
import { extension } from "../filetype.js";

const main = document.getElementsByTagName("main")[0];
let download;

async function loadText() {
	const element = document.createElement("pre");
	element.innerText = await (await fetch("/raw" + window.path)).text();
	return element;
}

async function loadImage() {
	const image = document.createElement("div");
	image.classList.add("image")
	image.style.setProperty("--image", `url("/raw${window.path}")`);
	return image;
}

function loadElement(element) {
	document.getElementsByClassName("loading")[0].remove();
	main.appendChild(element)
}

export default function loadFile(data) {
	window.loadStylesheets(["/static/css/file.css"]);

	document.getElementById("container").prepend(createSidebar());
	document.body.appendChild(createToolbar());

	window.toolbar.addStretch();
	window.toolbar.addIcon("***REMOVED***", () => {
		download.src = "/raw" + window.path;
	}, [], "40%");

	const loading = document.createElement("p");
	loading.classList.add("loading");
	loading.innerText = "Loading...";
	main.appendChild(loading);
	
	const format = extension(window.path.split("/").slice(-1)[0]);

	let loader;
	if (!format) {
		loader = loadText();
	}
	else if (["png", "tiff", "jpg", "jpeg", "webp"].includes(format)) {
		loader = loadImage();
	}

	if (!loader) {
		loader = loadText();
	}

	loader.then(loadElement);

	download = document.createElement("iframe");
	download.style.display = "none";
	document.body.appendChild(download);
}
