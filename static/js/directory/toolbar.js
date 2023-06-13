class Toolbar {
	constructor(element) {
		this.element = element;
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

	addIcon(icon, action, classList = []) {
		const button = this.addButton("", action, classList.concat("icon"));
		button.style.setProperty("--icon", `url('${icon}')`);
		return button;
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

	return toolbar;
}
