class Sidebar {
	constructor(element) {
		this.element = element;
		this.sections = {};
	}

	addSection(name, items) {
		const section = document.createElement("section");
		this.element.appendChild(section);

		this.sections[name] = {
			element: section,
			items
		};

		const title = document.createElement("span");
		title.innerText = name;
		section.appendChild(title);

		for (let item_index = 0; item_index < items.length; item_index++) {
			this.sections[name].items[item_index].element = Sidebar.#addItemToSection(items[item_index], section);
		}

		return section;
	}

	static #addItemToSection(item, section) {
		const link = document.createElement("a");
		link.href = `/path${item.path}`;
		link.innerText = item.name;			
		section.appendChild(link);

		if (item.icon) {
			link.classList.add("icon");
			link.style.setProperty("--icon", `url('${item.icon}')`);

			if (item.icon_size) {
				link.style.setProperty("--icon-size", item.icon_size);
			}

			if (item.icon_offset) {
				link.style.setProperty("--icon-offset", item.icon_offset);
			}
		}

		return link;
	}

	containsPath(path) {
		for (const section of Object.values(this.sections)) {
			for (const item of section.items) {
				if (item.path === path) {
					return item.element;
				}
			}
		}

		return false;
	}
}

export default function createSidebar() {
	const sidebar = document.createElement("aside");
	window.sidebar = new Sidebar(sidebar);
	window.sidebar.addSection("Locations", [
		{
			icon: `***REMOVED***"${getComputedStyle(document.documentElement).getPropertyValue("--select-color").replace("#", "%23")}"/></svg>`,
			name: "Home",
			path: "/"
		},
		{
			icon: `***REMOVED***"${getComputedStyle(document.documentElement).getPropertyValue("--select-color").replace("#", "%23")}"/></svg>`,
			icon_offset: "12px",
			icon_size: "12.5px",
			name: "Documents",
			path: "/Documents"
		}
	]);
	
	const current_item = window.sidebar.containsPath(window.path);
	if (current_item) {
		current_item.classList.add("selected");
	}

	return sidebar;
}
