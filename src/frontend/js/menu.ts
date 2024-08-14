import globalContextMenu from "./directory/global_menu.js";

import { main } from "./sectioning.js";

type EntryData = [(() => void) | false, string?];
export type MenuEntries = Record<string, EntryData>;

function initializeContextMenu() {
	const menu = document.createElement("div");
	menu.id = "menu";
	menu.style.display = "none";
	document.body.appendChild(menu);

	return menu;
}

let menu = document.getElementById("menu");

if (!menu) {
	menu = initializeContextMenu();
}

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
	return menu.animate([
		{ opacity: 1 },
		{ opacity: 0 }
	], {
		duration: 200,
		easing: "ease-out"
	}).finished.then(() => {
		menu.style.display = "none"
	});
}

function appendMenuEntries(entries: MenuEntries) {
	for (const [name, options] of Object.entries(entries)) {
		const menu_entry = document.createElement("button");
		menu_entry.innerText = name;

		if (options[1]) {
			for (const className of options[1].split(" ")) {
				menu_entry.classList.add(className);
			}
		}

		if (options[0] instanceof Function) {
			menu_entry.addEventListener("click", () => {
				options[0]();
				void closeContextMenu();
			});
		}

		menu.appendChild(menu_entry);
	}
}

export default function createContextMenu(
	event: MouseEvent,
	entries: MenuEntries
) {
	if (menu.style.display === "flex") {
		void closeContextMenu().then(() => {
			createContextMenu(event, entries)
		});

		return;
	}

	while (menu.firstChild) {
		menu.removeChild(menu.firstChild)
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

		void closeContextMenu();
	}
});
