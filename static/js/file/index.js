import createSidebar from "../sidebar.js";
import createToolbar from "../toolbar.js";
import { extension } from "../filetype.js";

const main = document.getElementsByTagName("main")[0];
const source = "/raw" + window.path;
let download;

async function loadText() {
	const text = document.createElement("pre");
	text.innerText = await (await fetch(source)).text();
	return text;
}

async function loadImage() {
	const image_element = document.createElement("div");
	image_element.classList.add("image");
	image_element.style.setProperty("--image", `url("${source}")`);

	const image = new Image();
	image.addEventListener("error", function() {
		const error = document.createElement("p");
		error.innerText = "Failed to load image";
		image_element.appendChild(error);
	});
	image.src = source;
	return image_element;
}

async function loadPDF() {
	const embed = document.createElement("embed");
	embed.src = source;
	return embed;
}

function loadElement(element) {
	document.getElementsByClassName("loading")[0].remove();
	main.appendChild(element);
}

export default function loadFile(data) {
	window.loadStylesheets(["/static/css/file.css"]);

	document.getElementById("container").prepend(createSidebar());
	document.body.appendChild(createToolbar());

	window.toolbar.addStretch();
	window.toolbar.addIcon("***REMOVED***", () => {
		download.src = "/download" + window.path;
	}, [], "40%");

	const loading = document.createElement("p");
	loading.classList.add("loading");
	loading.innerText = "Loading...";
	main.appendChild(loading);
	
	const format = extension(window.path.split("/").slice(-1)[0]);

	let loader;
	if (!format) {
		loader = loadText();
	} else if (["apng", "avif", "bmp", "cur", "gif", "ico", "heic", "heif", "j2k", "jp2", "jpc", "jpe", "jpeg", "jpf", "jpg", "jpg2", "jpm", "jpx", "jfi", "jif", "jfif", "jxl", "jxr", "pjp", "pjpeg", "pjpg", "png", "svg", "svgz", "tif", "tiff", "webp", "xbm"].includes(format)) {
		loader = loadImage();
	} else if (["pdf", "lpdf"].includes(format)) {
		loader = loadPDF();
	}

	if (!loader) {
		loader = loadText();
	}

	loader.then(loadElement);

	download = document.createElement("iframe");
	download.style.display = "none";
	document.body.appendChild(download);
}
