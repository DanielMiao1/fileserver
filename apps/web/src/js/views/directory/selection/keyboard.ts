import toolbar from "../../../components/toolbar";

import {
	getFirstSelectedItem,
	getSelectedElements,
	selectByOffset,
	selectFirstItem
} from "./modify";

import {
	elementIsFirstColumn,
	elementIsLastColumn
} from "./indexing";

import { gridViewColumns, isGridView } from "../view";

export function scrollSelectionIntoView() {
	const header_height = toolbar.clientHeight;
	const selected_element = getSelectedElements()[0];

	if (!selected_element) {
		return;
	}

	const y_position = selected_element.offsetTop;
	const y_position_relative_to_header = y_position - header_height;
	const y_position_baseline = y_position + selected_element.clientHeight;

	if (
		y_position_relative_to_header < window.scrollY ||
		y_position_baseline > window.scrollY + window.innerHeight
	) {
		window.scrollTo(window.scrollX, y_position_relative_to_header);
	}
}

export function handleArrowUpKey(event: KeyboardEvent) {
	event.preventDefault();
	event.stopPropagation();

	if (isGridView()) {
		return selectByOffset(-gridViewColumns());
	}

	return selectByOffset(-1);
}

export function handleArrowDownKey(event: KeyboardEvent) {
	event.preventDefault();
	event.stopPropagation();

	if (isGridView()) {
		return selectByOffset(gridViewColumns());
	}

	return selectByOffset(1);
}

export function handleArrowLeftKey(event: KeyboardEvent) {
	event.preventDefault();
	event.stopPropagation();

	if (isGridView()) {
		const current_selection = getFirstSelectedItem();

		if (!current_selection) {
			return selectFirstItem();
		}

		if (!elementIsFirstColumn(current_selection)) {
			return selectByOffset(-1);
		}
	}

	return false;
}

export function handleArrowRightKey(event: KeyboardEvent) {
	event.preventDefault();
	event.stopPropagation();

	if (isGridView()) {
		const current_selection = getFirstSelectedItem();

		if (!current_selection) {
			return selectFirstItem();
		}

		if (!elementIsLastColumn(current_selection)) {
			return selectByOffset(1);
		}
	}

	return false;
}
