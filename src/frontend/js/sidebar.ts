import current_path from "./path.js";

import { container } from "./sectioning.js";

let sidebar: HTMLElement;

if (document.getElementsByTagName("aside")[0]) {
	sidebar = document.getElementsByTagName("aside")[0]!;
} else {
	sidebar = document.createElement("aside");

	if (document.getElementsByTagName("main")[0]) {
		document.getElementsByTagName("main")[0]?.before(sidebar);
	} else {
		container.appendChild(sidebar);
	}
}

interface SectionItemData {
	icon?: string;
	icon_offset?: string;
	icon_size?: string;
	name: string;
	path: string;
}

interface SectionMap {
	element: HTMLElement;
	items: {
		element: HTMLElement;
		data: SectionItemData;
	}[];
}

const sections: Record<string, SectionMap> = {};

export function addSidebarSection(name: string) {
	const section = document.createElement("section");
	sidebar.appendChild(section);

	const title = document.createElement("span");
	title.innerText = name;
	section.appendChild(title);

	sections[name] = {
		element: section,
		items: []
	};

	return section;
}

export function addSidebarItem(item: SectionItemData, section: HTMLElement) {
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

	const section_title_element = section.children[0] as HTMLElement;
	const section_name = section_title_element.innerText;

	sections[section_name]?.items.push({
		data: item,
		element: link
	});

	return link;
}

export function sidebarItemWithPath(path: string) {
	for (const section of Object.values(sections)) {
		for (const item of section.items) {
			if (item.data.path === path) {
				return item.element;
			}
		}
	}

	return false;
}

export function initiateSidebar() {
	const locations_section = addSidebarSection("Locations");

	// TODO: Create /static/img/sidebar_icons/
	addSidebarItem({
		icon: "/static/img/home.svg",
		name: "Home",
		path: "/"
	}, locations_section);

	addSidebarItem({
		icon: "/static/img/documents.svg",
		icon_offset: "12px",
		icon_size: "12.5px",
		name: "Documents",
		path: "/Documents"
	}, locations_section);

	const current_item = sidebarItemWithPath(current_path);
	if (current_item) {
		current_item.classList.add("selected");
	}

	return sidebar;
}
