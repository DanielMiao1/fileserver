import select, { selected } from "./selection.js";

const main = document.getElementsByTagName("main")[0];

export default function isGridView() {
	return localStorage.directory_view === "grid";
}

export function scrollSelectionIntoView() {
	if (!selected) {
		return;
	}

	const header_height = document.getElementsByTagName("header")[0].clientHeight;

	if (selected.offsetTop - header_height < window.scrollY || selected.offsetTop + selected.clientHeight > window.scrollY + window.innerHeight) {
		window.scrollTo(window.scrollX, selected.offsetTop - header_height);
	}
}

function getFirstSelectedItem() {
	if (typeof selected[Symbol.iterator] === "function") {
		return selected[0];
	}

	return selected;
}

function gridViewColumns() {
	return getComputedStyle(main).getPropertyValue("grid-template-columns").split(" ").length;
}

function itemIndex(item) {
	const main = document.getElementsByTagName("main")[0];
	return Array.prototype.indexOf.call(main.children, item);
}

function selectPreviousItem() {
	const sibling = getFirstSelectedItem().previousElementSibling;
	if (sibling) {
		return select(sibling);
	}
}

function selectNextItem() {
	const sibling = getFirstSelectedItem().nextElementSibling;
	if (sibling) {
		return select(sibling);
	}
}

export function handleArrowUpKey(event) {
	event.preventDefault();
	event.stopPropagation();

	if (!selected) {
		return select(main.children[0]);
	}

	if (isGridView()) {
		let sibling = getFirstSelectedItem();
		for (const _ of Array(gridViewColumns())) {
			sibling = sibling.previousElementSibling;

			if (!sibling) {
				return;
			}
		}

		return select(sibling);
	}

	selectPreviousItem();
}

export function handleArrowDownKey(event) {
	event.preventDefault();
	event.stopPropagation();

	if (!selected) {
		return select(main.children[0]);
	}

	if (isGridView()) {
		let sibling = getFirstSelectedItem();
		for (const _ of Array(gridViewColumns())) {
			sibling = sibling.nextElementSibling;

			if (!sibling) {
				return;
			}
		}

		return select(sibling);
	}

	selectNextItem();
}

export function handleArrowLeftKey(event) {
	event.preventDefault();
	event.stopPropagation();

	if (isGridView()) {
		if (!selected) {
			return select(main.children[0]);
		}

		if (itemIndex(getFirstSelectedItem()) % gridViewColumns() > 0) {
			selectPreviousItem();
		}
	}
}

export function handleArrowRightKey(event) {
	event.preventDefault();
	event.stopPropagation();

	if (isGridView()) {
		if (!selected) {
			return select(main.children[0]);
		}

		const columns = gridViewColumns();

		if (itemIndex(getFirstSelectedItem()) % columns !== columns - 1) {
			selectNextItem();
		}
	}
}
