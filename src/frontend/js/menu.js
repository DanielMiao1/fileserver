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
	menu.style.left = `${event.clientX}px`;
	menu.style.top = `${window.scrollY + event.clientY}px`;
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

async function regenerateContextMenu(event) {
	if (menu.style.display === "flex") {
		return closeContextMenu().then(() => regenerateContextMenu(event));
	}

	while (menu.firstChild) {
		menu.removeChild(menu.firstChild)
	}

	let target = event.target;
	while (target) {
		if (target.dataset && target.dataset.menu) {
			try {
				const { menuHandler } = await import(target.dataset.menu);

				if (menuHandler) {
					appendMenuEntries(menuHandler(event));
					repositionContextMenu(event);
					return openContextMenu();
				}

				console.warn(`Context menu handler does not exist in ${target.dataset.menu}`);
			} catch {
				console.warn(`Importing context menu handler for ${target} failed`);
			}
		} else {
			target = target.parentNode;
		}
	}
	
	appendMenuEntries({
		"Reload": [() => document.location.reload()]
	})

	repositionContextMenu(event);
	return openContextMenu();
}

document.addEventListener("contextmenu", async event => {
	event.preventDefault();
	event.stopPropagation();
	await regenerateContextMenu(event);
	return false;
}, true);

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
