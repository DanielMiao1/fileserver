import createSidebar from "/static/js/sidebar.js";
import createToolbar from "/static/js/toolbar.js";
import { extension } from "/static/js/filetype.js";
import { default as loadText } from "/static/js/file/loaders/text.js";
import { default as loadImage } from "/static/js/file/loaders/image.js";
import { default as loadPDF } from "/static/js/file/loaders/pdf.js";

const main = document.getElementsByTagName("main")[0];
const source = "/raw" + window.path;
let download;

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
		loader = loadText(source);
	} else if (["apng", "avif", "bmp", "cur", "gif", "ico", "heic", "heif", "j2k", "jp2", "jpc", "jpe", "jpeg", "jpf", "jpg", "jpg2", "jpm", "jpx", "jfi", "jif", "jfif", "jxl", "jxr", "pjp", "pjpeg", "pjpg", "png", "svg", "svgz", "tif", "tiff", "webp", "xbm"].includes(format)) {
		loader = loadImage(source);
	} else if (["pdf", "lpdf"].includes(format)) {
		loader = loadPDF(source);
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
		loader = loadText(source);
	}

	loader.then(loadElement);

	download = document.createElement("iframe");
	download.style.display = "none";
	document.body.appendChild(download);
}
