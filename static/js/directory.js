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
	let ancestor = event.target.parentNode;

	while (ancestor) {
		if (ancestor.nodeName == "MAIN") {
			return;
		}

		ancestor = ancestor.parentNode;
	}

	select();
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
