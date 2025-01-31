import isEditing from "../edit";

import { main } from "../../../util/dom/sectioning";
import { nthSiblingOf } from "./indexing";

let multi_select = false;
let selected: HTMLElement[] = [];

export function isMultiSelecting() {
	return multi_select;
}

export function getSelectedElements() {
	return selected;
}

export function getFirstSelectedItem() {
	if (!selected[0]) {
		return null;
	}

	return selected[0];
}

function deselectAll() {
	for (const element of selected) {
		element.classList.remove("selected");
	}

	selected = [];
}

export function select(
	elements?: HTMLElement[] | Element[] | HTMLCollection,
	cumulate?: boolean
) {
	if (!elements || elements.length === 0) {
		if (!cumulate) {
			deselectAll();
		}

		return selected;
	}

	if (cumulate) {
		for (const item of elements) {
			item.classList.add("selected");
			selected.push(item as HTMLElement);
		}

		return selected;
	}

	deselectAll();

	for (const item of elements) {
		item.classList.add("selected");
		selected.push(item as HTMLElement);
	}

	return selected;
}

export function selectFirstItem() {
	const first_item = main.children[0];

	if (!first_item) {
		return false;
	}

	return select([first_item]);
}

export function selectByOffset(offset: number) {
	if (getSelectedElements().length === 0) {
		return selectFirstItem();
	}

	const current_selection = getFirstSelectedItem();

	if (!current_selection) {
		return false;
	}

	const target_element = nthSiblingOf(current_selection, offset);

	if (!target_element) {
		return false;
	}

	return select([target_element]);
}

window.addEventListener("keydown", event => {
	if (["Control", "Meta", "Shift"].includes(event.key)) {
		multi_select = true;
	}

	if (isEditing()) {
		return;
	}

	if (event.key === "a" && (event.metaKey || event.ctrlKey)) {
		select(main.children);
		event.preventDefault();
		event.stopPropagation();
	}
}, true);

window.addEventListener("keyup", event => {
	if (["Control", "Meta", "Shift"].includes(event.key)) {
		multi_select = false;
	}
});
