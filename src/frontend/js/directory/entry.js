import filetype, { extension, hasExtension } from "../filetype.js";
import select, { multi_select } from "./selection.js";

const container = document.getElementsByTagName("main")[0];

function navigateToRelative(name) {
	if (!document.getElementById("rename")) {
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

export function appendGridViewEntry(name, is_directory) {
	const button = document.createElement("button");
	button.title = name;
	button.dataset.menu = "/static/js/directory/file_menu.js"

	if (is_directory) {
		button.classList.add("directory");
	}

	if (name.startsWith(".")) {
		button.classList.add("hidden");
	} else if (!is_directory && hasExtension(name)) {
		button.classList.add(`file-${extension(name)}`)
	}

	button.addEventListener("mousedown", event => selectItem(event.button, button));
	button.addEventListener("dblclick", () => navigateToRelative(name));

	const text_container = document.createElement("span");
	text_container.innerText = name;
	button.appendChild(text_container);

	container.appendChild(button);

	return button;
}

export function appendListViewEntry(name, is_directory) {
	const row = document.createElement("div")
	row.dataset.menu = "/static/js/directory/file_menu.js"
	row.addEventListener("mousedown", event => selectItem(event.button, row));
	row.addEventListener("dblclick", () => navigateToRelative(name));
	
	if (is_directory) {
		row.classList.add("directory");
	}

	if (name.startsWith(".")) {
		row.classList.add("hidden");
	} else if (!is_directory && hasExtension(name)) {
		row.classList.add(`file-${extension(name)}`)
	}
	
	const filename = document.createElement("p");
	filename.innerText = name;
	filename.title = name;
	row.appendChild(filename);
	
	const format = document.createElement("p");
	format.innerText = filetype(name);
	row.appendChild(format);
	
	container.appendChild(row);

	return row;
}
