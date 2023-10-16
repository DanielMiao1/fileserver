import createSidebar from "/static/js/sidebar.js";
import createToolbar from "/static/js/toolbar.js";

const main = document.getElementsByTagName("main")[0];

const descriptions = {
	404: "The requested path could not be found.",
	500: "An error occured while transferring the content."
}

export default async function load(code) {
	window.loadStylesheets(["/static/css/error.css"]);

	document.getElementById("container").prepend(createSidebar());
	document.body.appendChild(createToolbar());

	const error_text = document.createElement("h1");
	error_text.innerText = code;
	main.appendChild(error_text);

	const description = document.createElement("p");
	description.innerText = descriptions[code];
	main.appendChild(description);
}