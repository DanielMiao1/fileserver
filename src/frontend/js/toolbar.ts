import current_path from "./path.js";

type event_callback = (this: HTMLButtonElement, event: MouseEvent) => void;

let toolbar: HTMLElement;

if (document.getElementsByTagName("header")[0]) {
	toolbar = document.getElementsByTagName("header")[0]!;
} else {
	toolbar = document.createElement("header");
	document.body.appendChild(toolbar);
}

export default toolbar;

export function addToolbarText(text: string, classList = []) {
	const element = document.createElement("p");
	element.innerText = text;
	for (const classItem of classList) {
		element.classList.add(classItem);
	}

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

	toolbar.appendChild(button);
	return button;
}

export function addToolbarIcon(
	icon: string,
	action: event_callback,
	icon_size: string,
	classList: string[] = []
): HTMLButtonElement {
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

	toolbar.appendChild(stretch);
	return stretch;
}

export function initiateToolbar() {
	addToolbarIcon(
		"/static/img/back_arrow.svg",
		() => {
			let path = document.location.pathname.toString();
			if (path.endsWith("/")) {
				path = path.slice(0, -1);
			}

			if (document.location.pathname.length > 6) {
				document.location = path.slice(0, path.lastIndexOf("/"));
			}
		},
		"",
		document.location.pathname.length <= 6 ? ["disabled"] : []
	);

	let current_name = current_path.slice(current_path.lastIndexOf("/") + 1);
	current_name = decodeURIComponent(current_name);
	addToolbarText(current_name || document.location.hostname);

	return toolbar;
}
