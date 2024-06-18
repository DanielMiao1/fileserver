import filetype, { extension, hasExtension } from "../filetype.js";
import isGridView, { handleArrowDownKey, handleArrowLeftKey, handleArrowRightKey, handleArrowUpKey, scrollSelectionIntoView } from "./keyboard_navigation.js";
import select, { initiateDragSelection, multi_select } from "./selection.js";

if (!localStorage.directory_view) {
	localStorage.directory_view = "grid";
}

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

function createGridView(items) {
	window.loadStylesheets(["/static/css/directory/grid.css"]);
	container.classList.add("grid");

	for (const [item, type] of Object.entries(items)) {
		const button = document.createElement("button");
		button.title = item;
		button.dataset.menu = "/static/js/directory/menu.js"

		if (type) {
			button.classList.add("directory");
		}

		if (item.startsWith(".")) {
			button.classList.add("hidden");
		} else if (!type && hasExtension(item)) {
			button.classList.add(`file-${extension(item)}`)
		}

		button.addEventListener("mousedown", event => selectItem(event.button, button));
		button.addEventListener("dblclick", () => navigateToRelative(item));

		const text_container = document.createElement("span");
		text_container.innerText = item;
		button.appendChild(text_container);

		container.appendChild(button);
	}

	initiateDragSelection();
}

function createListView(items) {
	window.loadStylesheets(["/static/css/directory/list.css"]);
	container.classList.add("list");
	
	for (const [item, type] of Object.entries(items)) {
		const row = document.createElement("div")
		row.dataset.menu = "/static/js/directory/menu.js"
		row.addEventListener("mousedown", event => selectItem(event.button, row));
		row.addEventListener("dblclick", () => navigateToRelative(item));
		
		if (type) {
			row.classList.add("directory");
		}
		if (item.startsWith(".")) {
			row.classList.add("hidden");
		} else if (!type && hasExtension(item)) {
			row.classList.add(`file-${extension(item)}`)
		}
		
		const filename = document.createElement("p");
		filename.innerText = item;
		filename.title = item;
		row.appendChild(filename);
		
		const format = document.createElement("p");
		format.innerText = filetype(item);
		row.appendChild(format);
		
		container.appendChild(row);
	}
}

export default function createDirectoryView(items) {
	if (!Object.keys(items).length) {
		return;
	}
	
	if (isGridView()) {
		createGridView(items);
	} else {
		createListView(items);
	}

	window.addEventListener("keydown", event => {
		if (!document.getElementById("rename")) {
			switch (event.key) {
				case "ArrowUp":
					handleArrowUpKey(event);
					scrollSelectionIntoView();
					break;
				case "ArrowDown":
					handleArrowDownKey(event);
					scrollSelectionIntoView();
					break;
				case "ArrowLeft":
					handleArrowLeftKey(event);
					scrollSelectionIntoView();
					break;
				case "ArrowRight":
					handleArrowRightKey(event);
					scrollSelectionIntoView();
					break;
			}
		}
	});
}
