import { initiateSidebar } from "./sidebar.js";
import { initiateToolbar } from "./toolbar.js";
import { main } from "./sectioning.js";

function getErrorDescription(code: number) {
	switch (code) {
		case 404:
			return "The requested path could not be found.";
		case 500:
			return "An error occured while transferring the content.";
	}

	return "";
}

export default function createErrorElement(code: number) {
	void import("../css/error.scss");

	initiateSidebar();
	initiateToolbar();

	const error_text = document.createElement("h1");
	error_text.innerText = code.toString();
	main.appendChild(error_text);

	const description = document.createElement("p");
	description.innerText = getErrorDescription(code);
	main.appendChild(description);
}
