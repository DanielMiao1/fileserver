import { select, multi_select } from "/static/js/directory/selection.js";

export default function loadDirectory(items) {
	const container = document.getElementsByTagName("main")[0];

	for (const [item, type] of Object.entries(items)) {
		const button = document.createElement("button");
		button.title = item;
		button.dataset.menu = "/static/js/directory/menu.js"

		if (type) {
			button.classList.add("directory");
		}

		if (item.startsWith(".")) {
			button.classList.add("hidden");
		} else if (!type && item.includes(".")) {
			button.classList.add("file-" + item.slice(item.lastIndexOf(".") + 1).toLowerCase())
		}

		button.addEventListener("mousedown", function(event) {
			if (event.button === 1) {
				return;
			}

			select(this, multi_select);
		});

		button.addEventListener("dblclick", function() {
			document.location = (
				document.location.pathname.endsWith("/") ?
				document.location.pathname :
				document.location.pathname + "/"
			) + item;
		});

		const text_container = document.createElement("span");
		text_container.innerText = item;
		button.appendChild(text_container);

		container.appendChild(button);
	}

	const file_upload = document.createElement("input");
	file_upload.type = "file";
	file_upload.id = "file";
	file_upload.name = "file";

	const file_upload_wrapper = document.createElement("form");
	file_upload_wrapper.method = "post";
	file_upload_wrapper.enctype = "multipart/form-data";

	file_upload_wrapper.appendChild(file_upload);
	document.body.appendChild(file_upload_wrapper);
}
