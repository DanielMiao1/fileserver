export function menuHandler(event) {
	return {
		"Open": () => event.target.click(),
		"Remove": () => event.target.click(),
		"Rename": () => event.target.click(),
		"Download": () => event.target.click(),
	}
}

export default function loadDirectory(items) {
	const container = document.getElementsByTagName("main")[0];

	for (const [item, type] of Object.entries(items)) {
		const button = document.createElement("button");
		button.dataset.menu = "/static/js/directory.js"

		if (type) {
			button.classList.add("directory");
		}

		if (item.startsWith(".")) {
			button.classList.add("hidden");
		} else if (!type && item.includes(".")) {
			button.classList.add("file-" + item.slice(item.lastIndexOf(".") + 1))
		}

		button.innerText = item;
		button.addEventListener("click", function() {
			document.location = (
				document.location.pathname.endsWith("/") ?
				document.location.pathname :
				document.location.pathname + "/"
			) + item;
		});
		container.appendChild(button);
	}
}
