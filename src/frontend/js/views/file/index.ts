import current_path from "../../util/path";

import {
	addToolbarIcon,
	addToolbarStretch,
	initiateToolbar
} from "../../components/toolbar";

import { extension } from "../../util/filetype";
import { initiateDownloader } from "../../util/dom/downloader";
import { initiateSidebar } from "../../components/sidebar";
import { main } from "../../util/dom/sectioning";

import { default as loadImage } from "./loaders/image";
import { default as loadPDF } from "./loaders/pdf";
import { default as loadText } from "./loaders/text";

interface SyntaxesData {
	extensions: Record<string, string>;
	filenames: Record<string, string>;
}

const source = `/raw${current_path}`;
let download_iframe: HTMLIFrameElement;

function loadElement(element: HTMLElement) {
	const loading_element = document.getElementsByClassName("loading")[0];

	if (loading_element) {
		loading_element.remove();
	}

	main.appendChild(element);
}

export default async function loadFile() {
	import("../../../css/file/index.scss").catch((error: unknown) => {
		console.error(error);
		throw new Error("Failed to load css file");
	});

	initiateSidebar();
	initiateToolbar();

	addToolbarStretch();
	addToolbarIcon("/static/img/icons/toolbar/download.svg", () => {
		download_iframe.src = `/download${current_path}`;
	}, "40%");

	const loading = document.createElement("p");
	loading.classList.add("loading");
	loading.innerText = "Loading...";
	main.appendChild(loading);

	const filename = current_path.slice(current_path.lastIndexOf("/") + 1);

	const format = extension(filename.toLowerCase());

	let content;

	if (!format) {
		content = loadText(source);
	} else if ([
		"apng",
		"avif",
		"bmp",
		"cur",
		"gif",
		"ico",
		"heic",
		"heif",
		"j2k",
		"jp2",
		"jpc",
		"jpe",
		"jpeg",
		"jpf",
		"jpg",
		"jpg2",
		"jpm",
		"jpx",
		"jfi",
		"jif",
		"jfif",
		"jxl",
		"jxr",
		"pjp",
		"pjpeg",
		"pjpg",
		"png",
		"svg",
		"svgz",
		"tif",
		"tiff",
		"webp",
		"xbm"
	].includes(format)) {
		content = loadImage(source);
	} else if (["pdf", "lpdf"].includes(format)) {
		content = loadPDF(source);
	}

	const syntaxes_file = await fetch("/static/file_syntaxes.json");
	const syntaxes = await syntaxes_file.json() as SyntaxesData;

	if (format in syntaxes.extensions) {
		content = loadText(source, syntaxes.extensions[format]);
	} else if (filename in syntaxes.filenames) {
		content = loadText(source, syntaxes.filenames[filename]);
	}

	content ??= loadText(source);

	try {
		loadElement(await content as HTMLElement);
	} catch (error: unknown) {
		console.error(error);
		throw new Error(`Loader failed for filetype ${format}`);
	}

	download_iframe = initiateDownloader();
}
