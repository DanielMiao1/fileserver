import { appendGridViewEntry, appendListViewEntry } from "./entry.js";
import isGridView, { handleArrowDownKey, handleArrowLeftKey, handleArrowRightKey, handleArrowUpKey, scrollSelectionIntoView } from "./keyboard_navigation.js";
import { initiateDragSelection } from "./selection.js";

if (!localStorage.directory_view) {
	localStorage.directory_view = "grid";
}

const container = document.getElementsByTagName("main")[0];

function createGridView(items) {
	window.loadStylesheets(["/static/css/directory/grid.css"]);
	container.classList.add("grid");
	container.dataset.menu = "/static/js/directory/global_menu.js";

	for (const [item, type] of Object.entries(items)) {
		appendGridViewEntry(item, type);
	}

	initiateDragSelection();
}

function createListView(items) {
	window.loadStylesheets(["/static/css/directory/list.css"]);
	container.classList.add("list");
	container.dataset.menu = "/static/js/directory/global_menu.js";
	
	for (const [item, type] of Object.entries(items)) {
		appendListViewEntry(item, type);
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
		if (
			!document.getElementById("rename") &&
			!document.getElementById("drag_selection")
		) {
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
