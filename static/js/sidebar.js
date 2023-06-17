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
			items: items
		};

		const title = document.createElement("span");
		title.innerText = name;
		section.appendChild(title);

		for (let item_index = 0; item_index < items.length; item_index++) {
			const link = document.createElement("a");
			link.href = "/path" + items[item_index].path;
			link.innerText = items[item_index].name;			
			section.appendChild(link);

			if (items[item_index].icon) {
				link.classList.add("icon");
				link.style.setProperty("--icon", `url('${items[item_index].icon}')`);

				if (items[item_index].icon_size) {
					link.style.setProperty("--icon-size", items[item_index].icon_size);
				}

				if (items[item_index].icon_offset) {
					link.style.setProperty("--icon-offset", items[item_index].icon_offset);
				}
			}

			this.sections[name].items[item_index].element = link;
		}

		return section;
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
			name: "Root",
			icon: `***REMOVED***"${getComputedStyle(document.documentElement).getPropertyValue("--select-color").replace("#", "%23")}"/></svg>`,
			path: "/"
		},
		{
			name: "Documents",
			icon: `***REMOVED***"${getComputedStyle(document.documentElement).getPropertyValue("--select-color").replace("#", "%23")}"/></svg>`,
			path: "/Documents",
			icon_size: "12.5px",
			icon_offset: "12px"
		}
	]);
	
	const current_item = window.sidebar.containsPath(window.path);
	if (current_item) {
		current_item.classList.add("selected");
	}

	return sidebar;
}
