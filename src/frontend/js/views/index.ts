import createErrorElement from "./error";
import current_path from "../util/path";
import loadDirectory from "./directory/index";
import loadFile from "./file/index";

import "../components/menu";

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

fetch(`/data${current_path}`).then(async response => {
	if (!response.ok) {
		createErrorElement(response.status);
		return;
	}

	const data = await response.json() as DirectoryData | FileData;

	if (data.type === "directory") {
		import("../../css/directory/popup.scss").catch((error: unknown) => {
			console.error(error);
			throw new Error("Failed to load css file");
		});
		loadDirectory(data);
	} else {
		await loadFile();
	}
}).catch((error: unknown) => {
	console.error(error);
	throw new Error("Failed to retrieve data for current path");
});
