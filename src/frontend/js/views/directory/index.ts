import createDirectoryView from "./view";

import {
	addToolbarIcon,
	addToolbarStretch,
	initiateToolbar
} from "../../components/toolbar";

import { initiateDownloader } from "../../util/dom/downloader";
import { initiateSidebar } from "../../components/sidebar";
import { prepareUploadElement } from "./upload";

interface DirectoryData {
	data: Record<string, boolean>;
	type: "directory";
}

function populateToolbar() {
	addToolbarStretch();

	const grid_view_icon_path = "/static/img/icons/toolbar/grid_view.svg";
	const grid_view = addToolbarIcon(grid_view_icon_path, () => {
		if (localStorage["directory_view"] !== "grid") {
			localStorage["directory_view"] = "grid";
			document.location.reload();
		}
	}, "45%");

	const list_view_icon_path = "/static/img/icons/toolbar/list_view.svg";
	const list_view = addToolbarIcon(list_view_icon_path, () => {
		if (localStorage["directory_view"] !== "list") {
			localStorage["directory_view"] = "list";
			document.location.reload();
		}
	}, "45%");

	if (localStorage["directory_view"] === "grid") {
		grid_view.classList.add("selected");
	} else {
		list_view.classList.add("selected");
	}
}

export default function loadDirectory(data: DirectoryData) {
	import("../../../css/directory/index.scss").catch((error: unknown) => {
		console.error(error);
		throw new Error("Failed to load css file");
	});

	createDirectoryView(data.data);

	initiateSidebar();
	initiateToolbar();
	populateToolbar();

	initiateDownloader();
	prepareUploadElement();
}
