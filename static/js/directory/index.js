import createDirectoryView from "/static/js/directory/view.js";
import createSidebar from "/static/js/directory/sidebar.js";
import createToolbar from "/static/js/directory/toolbar.js";

export default function loadDirectory(items) {
	window.loadStylesheets(["/static/css/directory/extensions.css", "/static/css/directory/toolbars.css", "/static/css/directory/index.css"]);

	createDirectoryView(items);

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
}
