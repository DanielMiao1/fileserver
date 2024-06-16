class Toolbar {
	constructor(element) {
		this.element = element;
	}

	addText(text, classList = []) {
		const element = document.createElement("p");
		element.innerText = text;
		for (const classItem of classList) {
			element.classList.add(classItem);
		}

		this.element.appendChild(element);
		return element;
	}

	addButton(text, action, classList = []) {
		const button = document.createElement("button");
		button.innerText = text;
		button.addEventListener("click", action);
		for (const classItem of classList) {
			button.classList.add(classItem)
		}

		this.element.appendChild(button);
		return button;
	}

	addIcon(icon, action, classList = [], icon_size) {
		const button = this.addButton("", action, classList.concat("icon"));
		button.style.setProperty("--icon", `url('${icon}')`);
		if (icon_size) {
			button.style.setProperty("--icon-size", icon_size);
		}

		return button;
	}

	addStretch() {
		const stretch = document.createElement("div");
		stretch.classList.add("stretch");
		
		this.element.appendChild(stretch);
		return stretch;
	}
}

export default function createToolbar() {
	const toolbar = document.createElement("header");
	window.toolbar = new Toolbar(toolbar);
	window.toolbar.addIcon("***REMOVED***", () => {
		if (window.history_parsed.length >= 2) {
			window.history_parsed.pop();
		}
	}, window.history_parsed.length < 2 ? ["disabled"] : []);
	window.toolbar.addText(decodeURIComponent(window.path.slice(window.path.lastIndexOf("/") + 1)) || document.location.hostname);

	return toolbar;
}
