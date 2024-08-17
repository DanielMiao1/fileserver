import createDirectoryView from "./view.js";

import {
	addToolbarIcon,
	addToolbarStretch,
	initiateToolbar
} from "../toolbar.js";

import { initiateDownloader } from "../download.js";
import { initiateSidebar } from "../sidebar.js";
import { prepareUploadElement } from "./upload.js";

interface DirectoryData {
	data: Record<string, boolean>;
	type: "directory";
}

function populateToolbar() {
	addToolbarStretch();

	const grid_view = addToolbarIcon("/static/img/grid_view.svg", () => {
		if (localStorage.directory_view !== "grid") {
			localStorage.directory_view = "grid";
			document.location.reload();
		}
	}, "40%");

	const list_view = addToolbarIcon("/static/img/list_view.svg", () => {
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

export default function loadDirectory(data: DirectoryData) {
	void import("../../css/directory/index.scss");

	createDirectoryView(data.data);

	initiateSidebar();
	initiateToolbar();
	populateToolbar();

	initiateDownloader();
	prepareUploadElement();
}
