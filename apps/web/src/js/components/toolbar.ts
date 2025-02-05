import current_path from "../util/path";

type event_callback = (this: HTMLButtonElement, event: MouseEvent) => void;

function createToolbar() {
	const toolbar = document.createElement("header");
	document.body.appendChild(toolbar);

	return toolbar;
}

function getToolbar() {
	const toolbar = document.getElementsByTagName("header")[0];

	if (toolbar) {
		return toolbar;
	}

	return createToolbar();
}

const toolbar = getToolbar();

export default toolbar;

export function addToolbarElement(element: HTMLElement): HTMLElement {
	toolbar.appendChild(element);
	return element;
}

export function addToolbarButton(
	text: string,
	action: event_callback,
	classList: string[] = []
) {
	const button = document.createElement("button");
	button.innerText = text;
	button.addEventListener("click", action);
	for (const classItem of classList) {
		button.classList.add(classItem);
	}

	return addToolbarElement(button);
}

export function addToolbarIcon(
	icon: string,
	action: event_callback,
	icon_size = "",
	classList: string[] = []
): HTMLElement {
	const button = addToolbarButton("", action, [...classList, "icon"]);
	button.style.setProperty("--icon", `url('${icon}')`);
	if (icon_size) {
		button.style.setProperty("--icon-size", icon_size);
	}

	return button;
}

export function addToolbarStretch() {
	const stretch = document.createElement("div");
	stretch.classList.add("stretch");

	return addToolbarElement(stretch);
}

function createBreadcrumbs() {
	const breadcrumbs = document.createElement("div");
	breadcrumbs.classList.add("breadcrumbs");

	const root = document.createElement("button");
	root.innerText = document.location.hostname;
	root.addEventListener("click", () => {
		document.location = "/path/";
	});

	breadcrumbs.appendChild(root);

	let path = "";

	for (const directory of current_path.slice(1).split("/")) {
		if (directory) {
			path += `/${directory}`;

			const separator = document.createElement("p");
			separator.innerText = "/";
			breadcrumbs.appendChild(separator);

			const name = document.createElement("button");
			name.innerText = directory;
			name.title = path;

			name.addEventListener("click", () => {
				document.location = `/path${name.title}`;
			});

			breadcrumbs.appendChild(name);
		}
	}

	return breadcrumbs;
}

export function initiateToolbar() {
	addToolbarElement(createBreadcrumbs());

	return toolbar;
}
