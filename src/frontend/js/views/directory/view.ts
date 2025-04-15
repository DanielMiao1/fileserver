import { appendGridViewEntry, appendListViewEntry } from "./entry";
import { main } from "../../util/dom/sectioning";

import {
	handleArrowDownKey,
	handleArrowLeftKey,
	handleArrowRightKey,
	handleArrowUpKey,
	scrollSelectionIntoView
} from "./selection/keyboard";

import isDragSelecting, { initiateDragSelection } from "./selection/drag";
import isEditing from "./edit";

localStorage.directory_view ??= "grid";

function createGridView(items: Record<string, boolean>) {
	import("../../../css/directory/grid.scss").catch((error: unknown) => {
		console.error(error);
		throw new Error("Failed to load css file");
	});
	main.classList.add("grid");

	for (const [item, type] of Object.entries(items)) {
		appendGridViewEntry(item, type);
	}

	initiateDragSelection();
}

function createListView(items: Record<string, boolean>) {
	import("../../../css/directory/list.scss").catch((error: unknown) => {
		console.error(error);
		throw new Error("Failed to load css file");
	});
	main.classList.add("list");

	for (const [item, type] of Object.entries(items)) {
		appendListViewEntry(item, type);
	}
}

export function isGridView() {
	return localStorage.directory_view === "grid";
}

export function gridViewColumns() {
	const main_styles = getComputedStyle(main);
	const grid_columns = main_styles.getPropertyValue("grid-template-columns");

	return grid_columns.split(" ").length;
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

		const key = event.key;

		if (key === "ArrowUp") {
			handleArrowUpKey(event);
			scrollSelectionIntoView();
		} else if (key === "ArrowDown") {
			handleArrowDownKey(event);
			scrollSelectionIntoView();
		} else if (key === "ArrowLeft") {
			handleArrowLeftKey(event);
			scrollSelectionIntoView();
		} else if (key === "ArrowRight") {
			handleArrowRightKey(event);
			scrollSelectionIntoView();
		}
	});
}
