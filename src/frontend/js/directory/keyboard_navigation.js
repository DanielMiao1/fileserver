import { select, selected } from "./selection.js";

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
	return Array.prototype.indexOf.call(main.children, item);
}

function selectPreviousItem() {
	const sibling = getFirstSelectedItem().previousElementSibling;
	if (sibling) {
		return select(sibling);
	}

	return false;
}

function selectNextItem() {
	const sibling = getFirstSelectedItem().nextElementSibling;
	if (sibling) {
		return select(sibling);
	}

	return false;
}

export function handleArrowUpKey(event) {
	event.preventDefault();
	event.stopPropagation();

	if (!selected) {
		return select(main.children[0]);
	}

	if (isGridView()) {
		let sibling = getFirstSelectedItem();
		for (let index = 0; index < gridViewColumns(); index++) {
			sibling = sibling.previousElementSibling;

			if (!sibling) {
				return false;
			}
		}

		return select(sibling);
	}

	return selectPreviousItem();
}

export function handleArrowDownKey(event) {
	event.preventDefault();
	event.stopPropagation();

	if (!selected) {
		return select(main.children[0]);
	}

	if (isGridView()) {
		let sibling = getFirstSelectedItem();
		for (let index = 0; index < gridViewColumns(); index++) {
			sibling = sibling.nextElementSibling;

			if (!sibling) {
				return false;
			}
		}

		return select(sibling);
	}

	return selectNextItem();
}

export function handleArrowLeftKey(event) {
	event.preventDefault();
	event.stopPropagation();

	if (isGridView()) {
		if (!selected) {
			return select(main.children[0]);
		}

		if (itemIndex(getFirstSelectedItem()) % gridViewColumns() > 0) {
			return selectPreviousItem();
		}
	}

	return false;
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
			return selectNextItem();
		}
	}

	return false;
}
