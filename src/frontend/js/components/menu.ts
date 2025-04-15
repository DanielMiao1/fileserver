import globalContextMenu from "../views/directory/global_menu";

// TODO: Create interface for setting default context menu for each page

import { main } from "../util/dom/sectioning";

interface EntryData {
	classes?: string[];
	display_name?: string;
	id?: string;
	pressed_callback?: (() => void);
}

export type MenuEntries = EntryData[];

function initializeContextMenu() {
	const menu = document.createElement("div");
	menu.id = "menu";
	menu.style.display = "none";
	document.body.appendChild(menu);

	return menu;
}

let menu = document.getElementById("menu") ?? initializeContextMenu();
// TODO: Export initialization function instead of execution on import

function repositionContextMenu(event: MouseEvent) {
	if (!menu) {
		return false;
	}

	menu.style.left = `${event.clientX.toString()}px`;
	menu.style.top = `${(window.scrollY + event.clientY).toString()}px`;

	return true;
}

function openContextMenu() {
	menu.style.display = "flex";
}

function closeContextMenu() {
	const animation = menu.animate([
		{ opacity: 1 },
		{ opacity: 0 }
	], {
		duration: 200,
		easing: "ease-out"
	});

	animation.finished.then(() => {
		menu.style.display = "none";
	}).catch((error: unknown) => {
		console.error(error);
		throw new Error("Failed to play closing animation for context menu");
	});

	return animation.finished;
}

function appendMenuEntries(entries: MenuEntries) {
	for (const entry of entries) {
		const entry_element = document.createElement("button");

		if (entry.display_name) {
			entry_element.innerText = entry.display_name;
		}

		if (entry.classes) {
			entry_element.classList.add(...entry.classes);
		}

		if (entry.id) {
			entry_element.id = entry.id;
		}

		entry_element.addEventListener("mousedown", () => {
			if (entry.pressed_callback) {
				entry.pressed_callback();
			}

			closeContextMenu().catch((error: unknown) => {
				console.error(error);
				throw new Error("Failed to play closing animation for context menu");
			});
		});

		menu.appendChild(entry_element);
	}
}

export default function createContextMenu(
	event: MouseEvent,
	entries: MenuEntries
) {
	if (menu.style.display === "flex") {
		closeContextMenu().then(() => {
			createContextMenu(event, entries);
		}).catch((error: unknown) => {
			console.error(error);
			throw new Error("Failed to play closing animation for context menu");
		});

		return;
	}

	while (menu.firstChild) {
		menu.removeChild(menu.firstChild);
	}

	appendMenuEntries(entries);
	repositionContextMenu(event);
	openContextMenu();
}

document.addEventListener("contextmenu", event => {
	event.preventDefault();
	event.stopPropagation();
}, true);

main.addEventListener("mousedown", (event: MouseEvent) => {
	if (event.button === 2) {
		createContextMenu(event, globalContextMenu());
	}
});

document.addEventListener("mousedown", event => {
	if (event.button !== 2) {
		let ancestor = event.target as HTMLElement | null;
		while (ancestor) {
			if (ancestor.id === "menu") {
				return;
			}
			ancestor = ancestor.parentNode as HTMLElement | null;
		}

		closeContextMenu().catch((error: unknown) => {
			console.error(error);
			throw new Error("Failed to play closing animation for context menu");
		});
	}
});
