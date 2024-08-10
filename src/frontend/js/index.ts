import createErrorElement from "./error";
import loadDirectory from "./directory/index";
import loadFile from "./file/index";
import path from "./path";

import "./menu";

const title_element = document.getElementsByTagName("title")[0];
if (title_element) {
	title_element.innerText = `${path} on ${document.location.hostname}`;
}

fetch(`/data${path}`).then(async response => {
	if (!response.ok) {
		return createErrorElement(response.status);
	}

	const data = await response.json();

	if (data.type === "directory") {
		import("../css/directory/popup.scss");
		return loadDirectory(data);
	}
	
	return loadFile();
});
