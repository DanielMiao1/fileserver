import { initiateSidebar } from "./sidebar.js";
import { initiateToolbar } from "./toolbar.js";
import { main } from "./sectioning.js";

function getErrorDescription(code: number) {
	if (code === 404) {
		return "The requested path could not be found.";
	}

	if (code === 500) {
		return "An error occured while transferring the content.";
	}

	return "An unknown error occured.";
}

export default function createErrorElement(code: number) {
	import("../css/error.scss").catch((error: unknown) => {
		console.error(error);
		throw new Error("Failed to load css file");
	});

	initiateSidebar();
	initiateToolbar();

	const error_text = document.createElement("h1");
	error_text.innerText = code.toString();
	main.appendChild(error_text);

	const description = document.createElement("p");
	description.innerText = getErrorDescription(code);
	main.appendChild(description);
}
