import isEditing from "../edit";

import { isMultiSelecting, select } from "./modify";
import { main } from "../../../util/dom/sectioning";
import { removePxSuffix } from "../../../util/format";

let start_position: [number, number] | false = false;

let start_item: HTMLElement;
let escaped_start_item = false;

export default function isDragSelecting() {
	return Boolean(document.getElementById("drag-selection"));
}

function itemAtPosition(x: number, y: number) {
	for (const item of main.children) {
		const positions = item.getBoundingClientRect();
		const min_x = positions.x;
		const min_y = positions.y + window.scrollY;

		const max_x = positions.right;
		const max_y = positions.bottom + window.scrollY;

		if (min_x <= x && x <= max_x && min_y <= y && y <= max_y) {
			return item;
		}
	}

	return false;
}

function dragSelectedItems(selection: HTMLElement) {
	const selected_items: HTMLElement[] = [];

	const styles = selection.style;

	const width = removePxSuffix(styles.width);
	const height = removePxSuffix(styles.height);
	const left = removePxSuffix(styles.left);
	const top = removePxSuffix(styles.top);

	let minX = left;

	if (selection.dataset.negative_width) {
		minX -= width;
	}

	let minY = top;

	if (selection.dataset.negative_height) {
		minY -= height;
	}

	const maxX = minX + width;
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
	main.addEventListener("mousedown", (event: MouseEvent) => {
		if (isEditing() || !event.target) {
			return;
		}

		if (event.button === 0) {
			const x_pos = window.scrollX + event.clientX;
			const y_pos = window.scrollY + event.clientY;
			start_position = [x_pos, y_pos];
		}

		let target_element: HTMLElement | null = event.target as HTMLElement;

		escaped_start_item = true;

		while (target_element) {
			if (["MAIN", "BODY"].includes(target_element.nodeName)) {
				return;
			}

			if (target_element.nodeName === "BUTTON") {
				start_item = target_element;
				escaped_start_item = false;
			}

			target_element = target_element.parentElement;
		}
	});

	window.addEventListener("mouseup", (event: MouseEvent) => {
		start_position = false;

		if (isDragSelecting()) {
			document.getElementById("drag-selection")?.remove();
		} else if (event.target.tagName === "MAIN" && !isMultiSelecting()) {
			select();
		}
	});

	window.addEventListener("mousemove", (event: MouseEvent) => {
		if (!start_position) {
			return;
		}

		let selection = document.getElementById("drag-selection");

		const drag_x_pos = start_position[0];
		const drag_y_pos = start_position[1];

		if (!selection) {
			selection = document.createElement("div");
			selection.id = "drag-selection";
			selection.style.left = `${drag_x_pos.toString()}px`;
			selection.style.top = `${drag_y_pos.toString()}px`;
			document.body.appendChild(selection);
		}

		const x_pos = window.scrollX + event.clientX;
		const y_pos = window.scrollY + event.clientY;

		let width = x_pos - drag_x_pos;
		let height = y_pos - drag_y_pos;

		if (drag_x_pos + width >= document.body.clientWidth - 2) {
			width = document.body.clientWidth - 2 - drag_x_pos;
		}

		if (drag_y_pos + height >= document.body.clientHeight - 2) {
			height = document.body.clientHeight - 2 - drag_y_pos;
		}

		selection.style.width = `${Math.abs(width).toString()}px`;
		selection.style.height = `${Math.abs(height).toString()}px`;

		let transforms = "";

		if (width < 0) {
			transforms += `translateX(${width.toString()}px)`;
		} else {
			transforms += "translateX(0)";
		}

		transforms += " ";

		if (height < 0) {
			transforms += `translateY(${height.toString()}px)`;
		} else {
			transforms += "translateY(0)";
		}

		selection.style.transform = transforms;

		if (width < 0) {
			if (!selection.hasAttribute("data-negative_width")) {
				selection.setAttribute("data-negative_width", "1");
			}
		} else if (selection.dataset.negative_width) {
			selection.removeAttribute("data-negative_width");
		}

		if (height < 0) {
			if (!selection.hasAttribute("data-negative_height")) {
				selection.setAttribute("data-negative_height", "1");
			}
		} else if (selection.dataset.negative_height) {
			selection.removeAttribute("data-negative_height");
		}

		if (!escaped_start_item) {
			const item_at_mouse = itemAtPosition(event.x, event.y);

			if (item_at_mouse === start_item) {
				return;
			}

			escaped_start_item = true;
		}

		const included_items = dragSelectedItems(selection);
		select(included_items, isMultiSelecting());
	});
}
