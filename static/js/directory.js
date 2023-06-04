let drag_selection_start_position = false;
let meta_pressed = false;
let selected;

function select(element, cumulate) {
	if (element && cumulate) {
		if (!selected) { 
			selected = [];
		}

		if (!selected.push) {
			selected = [selected];
		}

		if (element.push) {
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

	if (element.push) {
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


	for (const item of document.getElementsByTagName("main")[0].children) {
		const { x, y, bottom, right } = item.getBoundingClientRect();

		if (bottom >= minY && maxY >= y && right >= minX && maxX >= x) {
			selected_items.push(item);
		}
	}

	return selected_items;
}

window.addEventListener("mousedown", function(event) {
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

	if (!meta_pressed) {
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

	if (!meta_pressed) {
		select();
	}
	select(dragSelectedItems(selection), meta_pressed);
});

window.addEventListener("keydown", function(event) {
	if (["Control", "Meta"].includes(event.key)) {
		meta_pressed = true;
	}
});

window.addEventListener("keyup", function(event) {
	if (["Control", "Meta"].includes(event.key)) {
		meta_pressed = false;
	}
});

export function menuHandler(event) {
	return {
		"Open": () => event.target.dispatchEvent(new MouseEvent("dblclick")),
		"Remove": () => event.target.click(),
		"Rename": () => event.target.click(),
		"Download": () => event.target.click(),
	}
}

export default function loadDirectory(items) {
	const container = document.getElementsByTagName("main")[0];

	for (const [item, type] of Object.entries(items)) {
		const button = document.createElement("button");
		button.title = item;
		button.dataset.menu = "/static/js/directory.js"

		if (type) {
			button.classList.add("directory");
		}

		if (item.startsWith(".")) {
			button.classList.add("hidden");
		} else if (!type && item.includes(".")) {
			button.classList.add("file-" + item.slice(item.lastIndexOf(".") + 1).toLowerCase())
		}

		button.addEventListener("mousedown", function(event) {
			if (event.button === 1) {
				return;
			}

			select(this, meta_pressed);
		});

		button.addEventListener("dblclick", function() {
			document.location = (
				document.location.pathname.endsWith("/") ?
				document.location.pathname :
				document.location.pathname + "/"
			) + item;
		});

		const text_container = document.createElement("span");
		text_container.innerText = item;
		button.appendChild(text_container);

		container.appendChild(button);
	}
}
