import { isMultiSelecting, select } from "./selection/modify";
import { main } from "../../util/dom/sectioning";

import createContextMenu from "../../components/menu";
import fileContextMenu from "./file_menu";
import filetype from "../../util/filetype";
import isEditing from "./edit";

function navigateToRelative(name: string) {
	if (!isEditing()) {
		let pathname = document.location.pathname;

		if (!pathname.endsWith("/")) {
			pathname = `${pathname}/`;
		}

		document.location = pathname + name;
	}
}

function selectItem(button: number, element: HTMLElement) {
	if (button !== 1 && !element.classList.contains("selected")) {
		select([element], isMultiSelecting());
	}
}

function assignFileIcon(filename: string) {
	for (const extension of ["jpeg", "jpg", "png", "rtf", "svg", "text", "txt"]) {
		if (filename.endsWith(`.${extension}`)) {
			return `/static/img/extensions/${extension}.svg`;
		}
	}

	return "/static/img/extensions/*.svg";
}

export function appendGridViewEntry(name: string, is_directory: boolean) {
	const button = document.createElement("button");
	button.title = name;

	if (name.startsWith(".")) {
		button.classList.add("hidden");
	}

	button.addEventListener("mousedown", event => {
		selectItem(event.button, button);

		if (event.button === 2) {
			createContextMenu(event, fileContextMenu(event));
			event.stopPropagation();
		}
	});

	button.addEventListener("dblclick", () => {
		navigateToRelative(name);
	});

	const file_icon_container = document.createElement("figure");
	button.appendChild(file_icon_container);

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

	main.appendChild(button);

	return button;
}

export function appendListViewEntry(name: string, is_directory: boolean) {
	const row = document.createElement("div");

	row.addEventListener("mousedown", event => {
		selectItem(event.button, row);

		if (event.button === 2) {
			createContextMenu(event, fileContextMenu(event));
			event.stopPropagation();
		}
	});

	row.addEventListener("dblclick", () => {
		navigateToRelative(name);
	});

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
		filetype(name).then(result => {
			format.innerText = result;
		}).catch(() => {
			format.innerText = "Unknown";
		});
	}

	row.appendChild(format);

	main.appendChild(row);

	return row;
}
