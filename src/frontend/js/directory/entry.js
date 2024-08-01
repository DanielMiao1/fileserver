import { multi_select, select } from "./selection.js";
import filetype from "../filetype.js";
import isEditing from "./edit.js";

const container = document.getElementsByTagName("main")[0];

function navigateToRelative(name) {
	if (!isEditing()) {
		document.location = `${(
			document.location.pathname.endsWith("/") ?
			document.location.pathname :
			`${document.location.pathname}/`
		)}${name}`;
	}
}

function selectItem(button, element) {
	if (button === 1) {
		return;
	}

	select(element, multi_select);
}

function assignFileIcon(filename) {
	for (const extension of ["jpeg", "jpg", "png", "rtf", "svg", "text", "txt"]) {
		if (filename.endsWith(`.${extension}`)) {
			return `/static/img/extensions/${extension}.svg`;
		}
	}

	return "/static/img/extensions/*.svg";
}

export function appendGridViewEntry(name, is_directory) {
	const button = document.createElement("button");
	button.title = name;
	button.dataset.menu = "/static/js/directory/file_menu.js"

	if (name.startsWith(".")) {
		button.classList.add("hidden");
	}

	button.addEventListener("mousedown", event => selectItem(event.button, button));
	button.addEventListener("dblclick", () => navigateToRelative(name));

	const file_icon_container = document.createElement("div");
	button.appendChild(file_icon_container)

	const file_icon = document.createElement("img");

	if (is_directory) {
		file_icon.src = "/static/img/directory.svg";
	} else {
		file_icon.src = assignFileIcon(name);
	}

	file_icon_container.appendChild(file_icon);

	const text_container = document.createElement("span");
	text_container.innerText = name;
	button.appendChild(text_container);

	container.appendChild(button);

	return button;
}

// eslint-disable-next-line max-statements
export function appendListViewEntry(name, is_directory) {
	const row = document.createElement("div")
	row.dataset.menu = "/static/js/directory/file_menu.js"
	row.addEventListener("mousedown", event => selectItem(event.button, row));
	row.addEventListener("dblclick", () => navigateToRelative(name));

	if (name.startsWith(".")) {
		row.classList.add("hidden");
	}

	const file_icon = document.createElement("img");

	if (is_directory) {
		file_icon.src = "/static/img/directory.svg";
	} else {
		file_icon.src = assignFileIcon(name);
	}

	row.appendChild(file_icon);
	
	const filename = document.createElement("p");
	filename.innerText = name;
	filename.title = name;
	row.appendChild(filename);
	
	const format = document.createElement("p");
	
	if (is_directory) {
		format.innerText = "Directory";
	} else {
		format.innerText = filetype(name);
	}

	row.appendChild(format);
	
	container.appendChild(row);

	return row;
}
