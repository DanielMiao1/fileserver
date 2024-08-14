import isEditing from "./edit.js";

import { main } from "../sectioning.js";

export let multi_select = false;
export let selected: HTMLElement[] = [];

let drag_selection_start_position: [number, number] | false = false;

export default function isDragSelecting() {
	return Boolean(document.getElementById("drag_selection"));
}

function deselectAll() {
	for (const element of selected) {
		element.classList.remove("selected");
	}

	selected = [];
}

export function select(
	elements?: HTMLElement[] | HTMLCollection,
	cumulate?: boolean
) {

	if (!elements || elements.length === 0) {
		deselectAll();
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

function dragSelectedItems(selection: HTMLElement) {
	const selected_items: HTMLElement[] = [];

	const width = parseFloat(selection.style.width.slice(0, -2));
	const height = parseFloat(selection.style.height.slice(0, -2))

	const minX = parseFloat(selection.style.left.slice(0, -2)) - (selection.dataset["negative_width"] ? width : 0);
	const maxX = minX + width;
	const minY = parseFloat(selection.style.top.slice(0, -2)) - (selection.dataset["negative_height"] ? height : 0);
	const maxY = minY + height;


	for (const item of main.children) {
		const positions = item.getBoundingClientRect();
		const x = positions.x;
		const y = positions.y + window.scrollY;
		const right = positions.right;
		const bottom = positions.bottom + window.scrollY;

		if (bottom >= minY && maxY >= y && right >= minX && maxX >= x) {
			selected_items.push(item as HTMLElement);
		}
	}

	return selected_items;
}

export function initiateDragSelection() {
	main.addEventListener("mousedown", event => {
		if (isEditing() || !event.target) {
			return;
		}

		if (event.button === 0) {
			drag_selection_start_position = [window.scrollX + event.clientX, window.scrollY + event.clientY];
		}

		const target_element = event.target as HTMLElement;

		let ancestor = target_element.parentNode;

		while (ancestor) {
			if (ancestor.nodeName === "MAIN") {
				return;
			}

			ancestor = ancestor.parentNode;
		}

		if (!multi_select) {
			select([]);
		}
	});

	window.addEventListener("mouseup", () => {
		drag_selection_start_position = false;

		if (isDragSelecting()) {
			document.getElementById("drag_selection").parentNode.removeChild(document.getElementById("drag_selection"));
		}
	});

	window.addEventListener("mousemove", event => {
		if (!drag_selection_start_position) {
			return;
		}

		let selection = document.getElementById("drag_selection");

		if (!selection) {
			selection = document.createElement("div");
			selection.id = "drag_selection";
			selection.style.left = `${drag_selection_start_position[0].toString()}px`;
			selection.style.top = `${drag_selection_start_position[1].toString()}px`;
			document.body.appendChild(selection);
		}

		let width = window.scrollX + event.clientX - drag_selection_start_position[0];
		let height = window.scrollY + event.clientY - drag_selection_start_position[1];

		if (drag_selection_start_position[0] + width >= document.body.clientWidth - 2) {
			width = document.body.clientWidth - 2 - drag_selection_start_position[0];
		}
			
		if (drag_selection_start_position[1] + height >= document.body.clientHeight - 2) {
			height = document.body.clientHeight - 2 - drag_selection_start_position[1];
		}

		selection.style.width = `${Math.abs(width).toString()}px`;
		selection.style.height = `${Math.abs(height).toString()}px`;

		selection.style.transform = `${(width < 0 ? `translateX(${width.toString()}px)` : "translateX(0)")} ${(height < 0 ? `translateY(${height.toString()}px)` : "translateY(0)")}`;

		if (width < 0) {
			if (!selection.hasAttribute("data-negative_width")) {
				selection.setAttribute("data-negative_width", "1")
			}
		} else if (selection.dataset["negative_width"]) {
			selection.removeAttribute("data-negative_width");
		}

		if (height < 0) {
			if (!selection.hasAttribute("data-negative_height")) {
				selection.setAttribute("data-negative_height", "1");
			}
		} else if (selection.dataset["negative_height"]) {
			selection.removeAttribute("data-negative_height");
		}

		select(dragSelectedItems(selection), multi_select);
	});
};

window.addEventListener("keydown", event => {
	if (["Control", "Meta", "Shift"].includes(event.key)) {
		multi_select = true;
	}

	if (!isEditing() && event.key === "a" && (event.metaKey || event.ctrlKey)) {
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
