export let multi_select = false;
let drag_selection_start_position = false;
let selected;

const main = document.getElementsByTagName("main")[0];

export default function select(element, cumulate) {
	if (element && cumulate) {
		if (!selected) { 
			selected = [];
		}

		if (!selected.push) {
			selected = [selected];
		}

		if (typeof element[Symbol.iterator] === "function") {
			for (const item of element) {
				item.classList.add("selected");
			}

			return selected.push(...element);
		}

		element.classList.add("selected");
		return selected.push(element);
	}

	if (selected) {
		if (selected.push) {
			for (const item of selected) {
				item.classList.remove("selected");
			}
		} else {
			selected.classList.remove("selected");
		}
	}

	if (!element) {
		selected = null;
		return;
	}

	if (typeof element[Symbol.iterator] === "function") {
		selected = [];

		for (const item of element) {
			item.classList.add("selected");
			selected.push(item);
		}

		return;
	}

	selected = element;
	selected.classList.add("selected");
}

function dragSelectedItems(selection) {
	const selected_items = [];

	const width = parseFloat(selection.style.width.slice(0, -2));
	const height = parseFloat(selection.style.height.slice(0, -2))

	const minX = parseFloat(selection.style.left.slice(0, -2)) - (selection.dataset.negative_width ? width : 0);
	const maxX = minX + width;
	const minY = parseFloat(selection.style.top.slice(0, -2)) - (selection.dataset.negative_height ? height : 0);
	const maxY = minY + height;


	for (const item of main.children) {
		const positions = item.getBoundingClientRect();
		const x = positions.x;
		const y = positions.y + window.scrollY;
		const right = positions.right;
		const bottom = positions.bottom + window.scrollY;

		if (bottom >= minY && maxY >= y && right >= minX && maxX >= x) {
			selected_items.push(item);
		}
	}

	return selected_items;
}

export function initiateDragSelection() {
	main.addEventListener("mousedown", function(event) {
		if (event.button === 0) {
			drag_selection_start_position = [event.clientX, window.scrollY + event.clientY];
		}

		let ancestor = event.target.parentNode;

		while (ancestor) {
			if (ancestor.nodeName == "MAIN") {
				return;
			}

			ancestor = ancestor.parentNode;
		}

		if (!multi_select) {
			select();
		}
	});

	window.addEventListener("mouseup", function() {
		drag_selection_start_position = false;

		if (document.getElementById("drag_selection")) {
			document.getElementById("drag_selection").parentNode.removeChild(document.getElementById("drag_selection"));
		}
	});

	window.addEventListener("mousemove", function(event) {
		if (!drag_selection_start_position) {
			return;
		}

		let selection = document.getElementById("drag_selection");

		if (!selection) {
			selection = document.createElement("div");
			selection.id = "drag_selection";
			selection.style.left = drag_selection_start_position[0] + "px";
			selection.style.top = drag_selection_start_position[1] + "px";
			document.body.appendChild(selection);
		}

		const width = event.clientX - drag_selection_start_position[0];
		const height = window.scrollY + event.clientY - drag_selection_start_position[1];

		selection.style.width = Math.abs(width) + "px";
		selection.style.height = Math.abs(height) + "px";

		selection.style.transform = (width < 0 ? `translateX(${width}px)` : "translateX(0)") + " " + (height < 0 ? `translateY(${height}px)` : "translateY(0)");

		if (width < 0) {
			if (!selection.dataset.negative_width) {
				selection.dataset.negative_width = "1";
			}
		} else if (selection.dataset.negative_width) {
			delete selection.dataset.negative_width;
		}

		if (height < 0) {
			if (!selection.dataset.negative_height) {
				selection.dataset.negative_height = "1";
			}
		} else if (selection.dataset.negative_height) {
			delete selection.dataset.negative_height;
		}

		select(dragSelectedItems(selection), multi_select);
	});
};

window.addEventListener("keydown", function(event) {
	if (["Control", "Meta", "Shift"].includes(event.key)) {
		multi_select = true;
	}

	if (event.key == "a" && (event.metaKey || event.ctrlKey)) {
		select(main.children);
		event.preventDefault();
		event.stopPropagation();
	}
}, true);

window.addEventListener("keyup", function(event) {
	if (["Control", "Meta", "Shift"].includes(event.key)) {
		multi_select = false;
	}
});

document.addEventListener("dragenter", function(event) {
	event.preventDefault();
	event.stopPropagation();
}, true);

document.addEventListener("dragover", function(event) {
	event.preventDefault();
	event.stopPropagation();
}, true);

document.addEventListener("dragleave", function(event) {
	event.preventDefault();
	event.stopPropagation();
}, true);

document.addEventListener("drop", function(event) {
	event.preventDefault();
	event.stopPropagation();
	
	const file = document.getElementById("file");
	file.files = event.dataTransfer.files;

	file.parentNode.action = "/write" + window.path + (window.path.endsWith("/") ? "" : "/");
	file.parentNode.submit();
}, true);
