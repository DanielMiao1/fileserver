import createErrorElement from "./error.js";
import current_path from "./path.js";
import loadDirectory from "./directory/index.js";
import loadFile from "./file/index.js";

import "./menu";

interface DirectoryData {
	data: Record<string, boolean>;
	type: "directory";
}

interface FileData {
	encoding: string | false;
	size: number;
	type: "file";
}

const title_element = document.getElementsByTagName("title")[0];

if (title_element) {
	title_element.innerText = `${current_path} on ${document.location.hostname}`;
}

void fetch(`/data${current_path}`).then(async response => {
	if (!response.ok) {
		createErrorElement(response.status);
		return;
	}

	const data = await response.json() as DirectoryData | FileData;

	if (data.type === "directory") {
		import("../css/directory/popup.scss").catch((error: unknown) => {
			console.error(error);
			throw new Error("Failed to load css file");
		});
		loadDirectory(data);
	} else {
		loadFile();
	}
});
