import toolbar from "../toolbar.js";

import { select, selected } from "./selection.js";

const main = document.getElementsByTagName("main")[0];

export default function isGridView() {
	return localStorage.directory_view === "grid";
}

export function scrollSelectionIntoView() {
	const header_height = toolbar.clientHeight;
	const selected_element = selected[0];

	if (!selected_element) {
		return;
	}

	const y_position_relative_to_header = selected_element.offsetTop - header_height;

	if (y_position_relative_to_header < window.scrollY || selected_element.offsetTop + selected_element.clientHeight > window.scrollY + window.innerHeight) {
		window.scrollTo(window.scrollX, y_position_relative_to_header);
	}
}

function gridViewColumns() {
	return getComputedStyle(main).getPropertyValue("grid-template-columns").split(" ").length;
}

function itemIndex(item) {
	return Array.prototype.indexOf.call(main.children, item);
}

function selectPreviousItem() {
	const sibling = selected[0].previousElementSibling;
	if (sibling) {
		return select([sibling]);
	}

	return false;
}

function selectNextItem() {
	const sibling = selected[0].nextElementSibling;
	if (sibling) {
		return select([sibling]);
	}

	return false;
}

export function handleArrowUpKey(event: KeyboardEvent) {
	event.preventDefault();
	event.stopPropagation();

	if (selected.length === 0) {
		return select([main.children[0]]);
	}

	if (isGridView()) {
		let sibling = selected[0];
		for (let index = 0; index < gridViewColumns(); index++) {
			sibling = sibling.previousElementSibling;

			if (!sibling) {
				return false;
			}
		}

		return select([sibling]);
	}

	return selectPreviousItem();
}

export function handleArrowDownKey(event: KeyboardEvent) {
	event.preventDefault();
	event.stopPropagation();

	if (selected.length === 0) {
		return select([main.children[0]]);
	}

	if (isGridView()) {
		let sibling = selected[0];

		if (!sibling) {
			return false;
		}

		for (let index = 0; index < gridViewColumns(); index++) {
			sibling = sibling.nextElementSibling;

			if (!sibling) {
				return false;
			}
		}

		return select([sibling]);
	}

	return selectNextItem();
}

export function handleArrowLeftKey(event: KeyboardEvent) {
	event.preventDefault();
	event.stopPropagation();

	if (isGridView()) {
		if (selected.length === 0) {
			return select([main.children[0]]);
		}

		if (itemIndex(selected[0]) % gridViewColumns() > 0) {
			return selectPreviousItem();
		}
	}

	return false;
}

export function handleArrowRightKey(event: KeyboardEvent) {
	event.preventDefault();
	event.stopPropagation();

	if (isGridView()) {
		if (selected.length === 0) {
			return select([main.children[0]]);
		}

		const columns = gridViewColumns();

		if (itemIndex(selected[0]) % columns !== columns - 1) {
			return selectNextItem();
		}
	}

	return false;
}
