import { appendGridViewEntry, appendListViewEntry } from "./entry.js";
import { main } from "../sectioning.js";

import isGridView, {
	handleArrowDownKey,
	handleArrowLeftKey,
	handleArrowRightKey,
	handleArrowUpKey,
	scrollSelectionIntoView
} from "./keyboard_navigation.js";

import isDragSelecting, { initiateDragSelection } from "./selection.js";
import isEditing from "./edit.js";

if (!localStorage["directory_view"]) {
	localStorage["directory_view"] = "grid";
}

function createGridView(items: Record<string, boolean>) {
	void import("../../css/directory/grid.scss");
	main.classList.add("grid");

	for (const [item, type] of Object.entries(items)) {
		appendGridViewEntry(item, type);
	}

	initiateDragSelection();
}

function createListView(items: Record<string, boolean>) {
	void import("../../css/directory/list.scss");
	main.classList.add("list");

	for (const [item, type] of Object.entries(items)) {
		appendListViewEntry(item, type);
	}
}

export default function createDirectoryView(items: Record<string, boolean>) {
	if (isGridView()) {
		createGridView(items);
	} else {
		createListView(items);
	}

	window.addEventListener("keydown", event => {
		if (isEditing() || isDragSelecting()) {
			return;
		}

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
	});
}
