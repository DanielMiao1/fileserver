import { gridViewColumns, isGridView } from "../view.js";
import { main } from "../../sectioning.js";

export function nthSiblingOf(element: Element, offset: number) {
	let current_element: Element | null = element;

	for (let index = 0; index < Math.abs(offset); index++) {
		if (!current_element) {
			return false;
		}

		if (offset < 0) {
			current_element = current_element.previousElementSibling;
		} else {
			current_element = current_element.nextElementSibling;
		}
	}

	return current_element;
}

function indexOfElement(item: Element) {
	return Array.prototype.indexOf.call(main.children, item);
}


function elementColumnIndex(element: Element) {
	if (!isGridView()) {
		return 0;
	}

	const index = indexOfElement(element);
	const column_count = gridViewColumns();

	const index_in_row = index % column_count;

	return index_in_row;
}

export function elementIsFirstColumn(element: Element) {
	const column_index = elementColumnIndex(element);

	return column_index === 0;
}

export function elementIsLastColumn(element: Element) {
	const column_index = elementColumnIndex(element);
	const column_count = gridViewColumns();

	return column_index === column_count - 1;
}
