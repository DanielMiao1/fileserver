import globalContextMenu from "./directory/global_menu.js";

function initializeContextMenu() {
	const menu = document.createElement("div");
	menu.id = "menu";
	menu.style.display = "none";
	document.body.appendChild(menu);
}

if (!document.getElementById("menu")) {
	initializeContextMenu();
}

const menu = document.getElementById("menu");

function repositionContextMenu(event: MouseEvent) {
	if (!menu) {
		return false;
	}

	menu.style.left = `${event.clientX}px`;
	menu.style.top = `${window.scrollY + event.clientY}px`;

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

function appendMenuEntries(entries) {
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
				closeContextMenu();
			});
		}

		menu.appendChild(menu_entry);
	}
}

export default async function createContextMenu(event, entries) {
	if (menu.style.display === "flex") {
		return closeContextMenu().then(() => createContextMenu(event, entries));
	}

	while (menu.firstChild) {
		menu.removeChild(menu.firstChild)
	}

	appendMenuEntries(entries);
	repositionContextMenu(event);
	return openContextMenu();
}

document.addEventListener("contextmenu", async event => {
	event.preventDefault();
	event.stopPropagation();
	return false;
}, true);

document.getElementsByTagName("main")[0].addEventListener("mousedown", event => {
	if (event.button === 2) {
		createContextMenu(event, globalContextMenu(event));
	}
});

document.addEventListener("mousedown", event => {
	if (event.button !== 2) {
		let ancestor = event.target;
		while (ancestor) {
			if (ancestor.id === "menu") {
				return;
			}
			ancestor = ancestor.parentNode;
		}

		closeContextMenu();
	}
});
