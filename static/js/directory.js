let drag_selection_start_position = false;

let selected;

function select(element) {
	if (selected) {
		selected.classList.remove("selected");
	}

	if (!element) {
		selected = null;
		return;
	}

	selected = element;
	selected.classList.add("selected");
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

	select();
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

	drag_selection_left_transform = width < 0 ? `translateX(${width}px)` : "";
	drag_selection_top_transform = height < 0 ? `translateY(${height}px)` : "";
	selection.style.transform = (width < 0 ? `translateX(${width}px)` : "translateX(0)") + " " + (height < 0 ? `translateY(${height}px)` : "translateY(0)");
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

			select(this);
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
