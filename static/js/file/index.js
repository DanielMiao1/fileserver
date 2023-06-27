import createSidebar from "../sidebar.js";
import createToolbar from "../toolbar.js";
import { extension } from "../filetype.js";
import { default as loadText } from "./loaders/text.js";

const main = document.getElementsByTagName("main")[0];
const source = "/raw" + window.path;
let download;

async function loadImage() {
	window.loadStylesheets(["/static/css/file/loaders/image.css"]);

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
	window.loadStylesheets(["/static/css/file/loaders/pdf.css"]);

	const embed = document.createElement("embed");
	embed.src = source;
	return embed;
}

function loadElement(element) {
	document.getElementsByClassName("loading")[0].remove();
	main.appendChild(element);
}

export default async function loadFile(data) {
	window.loadStylesheets(["/static/css/file/index.css"]);

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

	const filename = window.path.split("/").slice(-1)[0].toLowerCase();
	
	const format = extension(filename);

	let loader;
	if (!format) {
		loader = loadText();
	} else if (["apng", "avif", "bmp", "cur", "gif", "ico", "heic", "heif", "j2k", "jp2", "jpc", "jpe", "jpeg", "jpf", "jpg", "jpg2", "jpm", "jpx", "jfi", "jif", "jfif", "jxl", "jxr", "pjp", "pjpeg", "pjpg", "png", "svg", "svgz", "tif", "tiff", "webp", "xbm"].includes(format)) {
		loader = loadImage();
	} else if (["pdf", "lpdf"].includes(format)) {
		loader = loadPDF();
	} else if (["ada", "adb", "ads"].includes(format)) {
		loader = loadText(source, "ada");
	} else if (format === "as") {
		loader = loadText(source, "actionscript");
	} else if (["applescript", "scpt"].includes(format)) {
		loader = loadText(source, "applescript");
	} else if (["atom", "htm", "html", "plist", "rss", "svg", "xhtm", "xhtml", "xml", "xsd", "xsl"].includes(format)) {
		loader = loadText(source, "xml");
	} else if (["bash", "sh", "zsh"].includes(format)) {
		loader = loadText(source, "bash");
	} else if (["c", "h"].includes(format)) {
		loader = loadText(source, "c");
	} else if (["c#", "cs", "csx"].includes(format)) {
		loader = loadText(source, "csharp");
	} else if (["c++", "cc", "cpp", "cxx", "h++", "hh", "hpp", "hxx"].includes(format)) {
		loader = loadText(source, "c");
	} else if (["cjs", "js", "jsx", "mjs"].includes(format)) {
		loader = loadText(source, "javascript");
	} else if (format === "cmake" || filename === "cmakelists.txt") {
		loader = loadText(source, "cmake");
	} else if (format === "css") {
		loader = loadText(source, "css");
	} else if (filename === "dockerfile") {
		loader = loadText(source, "docker");
	} else if (["f", "f77", "f90", "f95", "for"].includes(format)) {
		loader = loadText(source, "fortran");
	} else if (format === "go") {
		loader = loadText(source, "go");
	} else if (["gql", "graphql"].includes(format)) {
		loader = loadText(source, "graphql");
	} else if (format === "hs") {
		loader = loadText(source, "haskell");
	} else if (["ini", "toml"].includes(format)) {
		loader = loadText(source, "toml");
	} else if (format === "ino") {
		loader = loadText(source, "arduino");
	} else if (format === "json") {
		loader = loadText(source, "json");
	} else if (format === "java") {
		loader = loadText(source, "java");
	} else if (format === "lua") {
		loader = loadText(source, "lua");
	} else if (filename === "makefile") {
		loader = loadText(source, "makefile");
	} else if (["md", "mdx", "mkd", "markdn", "markdown"].includes(format)) {
		loader = loadText(source, "markdown");
	} else if (["m", "mm"].includes(format)) {
		loader = loadText(source, "objectivec");
	} else if (["php", "php2", "php3", "php4", "php5"].includes(format)) {
		loader = loadText(source, "php");
	}	else if (format === "py") {
		loader = loadText(source, "python");
	}	else if (format === "qml") {
		loader = loadText(source, "qml");
	}	else if (format === "rb") {
		loader = loadText(source, "ruby");
	}	else if (format === "rs") {
		loader = loadText(source, "rust");
	}	else if (format === "scss") {
		loader = loadText(source, "scss");
	}	else if (format === "sql") {
		loader = loadText(source, "sql");
	}	else if (format === "scala") {
		loader = loadText(source, "scala");
	}	else if (format === "swift") {
		loader = loadText(source, "swift");
	} else if (["tcl", "tk"].includes(format)) {
		loader = loadText(source, "tcl");
	} else if (["ts", "tsx"].includes(format)) {
		loader = loadText(source, "typescript");
	} else if (["yaml", "yml"].includes(format)) {
		loader = loadText(source, "yaml");
	}

	if (!loader) {
		loader = loadText();
	}

	loader.then(loadElement);

	download = document.createElement("iframe");
	download.style.display = "none";
	document.body.appendChild(download);
}
