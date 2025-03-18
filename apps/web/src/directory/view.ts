import type { directory_items } from "../api";

function loadDirectory(items: directory_items) {
	const root = document.createElement("div");
	root.classList.add("dir-root");

	document.body.appendChild(root);

	Object.entries(items).forEach(data => {
		const [name, is_file] = data;

		const button = document.createElement("div");
		button.classList.add("dir-item");

		const image = document.createElement("div");
		image.classList.add("dir-img");

		if (is_file) {
			image.dataset.type = "";
		} else {
			image.dataset.type = "dir";
		}

		button.appendChild(image);

		const label = document.createElement("p");
		label.innerText = name;

		button.appendChild(label);

		root.appendChild(button);
	});
}

export default loadDirectory;
