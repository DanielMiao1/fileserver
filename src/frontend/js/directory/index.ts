import createDirectoryView from "./view.js";
import createSidebar from "../sidebar.js";
import createToolbar from "../toolbar.js";

import { initiateDownloader } from "../download.js"
import { prepareUploadElement } from "./upload.js";

function populateToolbar() {
	window.toolbar.addStretch();

	const grid_view = window.toolbar.addIcon("***REMOVED***", () => {
		if (localStorage.directory_view !== "grid") {
			localStorage.directory_view = "grid";
			document.location.reload();
		}
	}, "40%");

	const list_view = window.toolbar.addIcon("***REMOVED***", () => {
		if (localStorage.directory_view !== "list") {
			localStorage.directory_view = "list";
			document.location.reload();
		}
	}, "40%");

	if (localStorage.directory_view === "grid") {
		grid_view.classList.add("selected");
	} else {
		list_view.classList.add("selected");
	}
}

export default function loadDirectory(data) {
	import("../../css/directory/index.scss");

	createDirectoryView(data.data);

	document.getElementById("container").prepend(createSidebar());
	document.body.appendChild(createToolbar());
	populateToolbar();
	
	initiateDownloader();
	prepareUploadElement();
}
