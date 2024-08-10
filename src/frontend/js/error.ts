import createSidebar from "./sidebar";
import createToolbar from "./toolbar";

function getErrorDescription(code: number) {
	switch (code) {
		case 404:
			return "The requested path could not be found.";
		case 500:
			return "An error occured while transferring the content."
	}

	return "";
}

export default function createErrorElement(code: number) {
	import("../css/error.scss");

	const container_element = document.getElementById("container")!;
	const main_element = document.getElementsByTagName("main")[0]!;

	container_element.prepend(createSidebar());
	document.body.appendChild(createToolbar());

	const error_text = document.createElement("h1");
	error_text.innerText = code.toString();
	main_element.appendChild(error_text);

	const description = document.createElement("p");
	description.innerText = getErrorDescription(code);
	main_element.appendChild(description);
}