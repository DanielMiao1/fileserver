function createContextMenu() {
	const menu = document.createElement("div");
	menu.id = "menu";
	menu.style.display = "none";
	document.body.appendChild(menu);
}

if (!document.getElementById("menu")) {
	createContextMenu();
}

const menu = document.getElementById("menu");

function repositionContextMenu(event) {
	menu.style.left = event.clientX + "px";
	menu.style.top = window.scrollY + event.clientY + "px";
}

function openContextMenu() {
	menu.style.display = "flex";
}

function closeContextMenu() {
	return menu.animate([{opacity: 1}, {opacity: 0}], {easing: "ease-out", duration: 200}).finished.then(() => menu.style.display = "none");
}

function appendMenuEntries(entries) {
	for (const [name, action] of Object.entries(entries)) {
		const menu_entry = document.createElement("button");
		menu_entry.innerText = name;
		menu_entry.addEventListener("click", () => {
			action()
			closeContextMenu();
		});
		menu.appendChild(menu_entry);
	}
}

async function regenerateContextMenu(event) {
	if (menu.style.display === "flex") {
		return closeContextMenu().then(() => regenerateContextMenu(event));
	}

	while (menu.firstChild) {
		menu.removeChild(menu.firstChild)
	}

	const target = event.target;
	if (target.dataset.menu) {
		try {
			const { menuHandler } = await import(target.dataset.menu);

			if (menuHandler) {
				appendMenuEntries(menuHandler(event));
			} else {
				console.warn(`Context menu handler does not exist in ${target.dataset.menu}`);
			}
		} catch {
			console.warn(`Importing context menu handler for ${target} failed`);
		}
	} else {
		appendMenuEntries({
			"Reload": () => document.location.reload()
		})
	}

	repositionContextMenu(event);

	openContextMenu();
}

document.addEventListener("contextmenu", async function(event) {
	event.preventDefault();
	event.stopPropagation();
	await regenerateContextMenu(event);
	return false;
});

document.addEventListener("mousedown", function(event) {
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
