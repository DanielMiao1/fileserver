import createDirectoryView from "./view.js";
import createSidebar from "../sidebar.js";
import createToolbar from "../toolbar.js";

function populateToolbar() {
	window.toolbar.addStretch();

	const grid_view = window.toolbar.addIcon("***REMOVED***", () => {
		if (localStorage.directory_view !== "grid") {
			localStorage.directory_view = "grid";
			document.location.reload();
		}
	}, [], "40%");

	const list_view = window.toolbar.addIcon("***REMOVED***", () => {
		if (localStorage.directory_view !== "list") {
			localStorage.directory_view = "list";
			document.location.reload();
		}
	}, [], "40%");

	if (localStorage.directory_view === "grid") {
		grid_view.classList.add("selected");
	} else {
		list_view.classList.add("selected");
	}
}

export default function loadDirectory(data) {
	window.loadStylesheets(["/static/css/directory/extensions.css", "/static/css/directory/index.css"]);

	createDirectoryView(data.data);

	const file_upload = document.createElement("input");
	file_upload.multiple = true;
	file_upload.type = "file";
	file_upload.id = "file";
	file_upload.name = "file";

	const file_upload_wrapper = document.createElement("form");
	file_upload_wrapper.method = "post";
	file_upload_wrapper.enctype = "multipart/form-data";

	file_upload_wrapper.appendChild(file_upload);
	document.body.appendChild(file_upload_wrapper);

	document.getElementById("container").prepend(createSidebar());
	document.body.appendChild(createToolbar());
	populateToolbar();
}
