import current_path from "../util/path";

import { main } from "../util/dom/sectioning";

function createSidebar() {
	const sidebar = document.createElement("aside");
	main.before(sidebar);

	return sidebar;
}

function getSidebar() {
	const sidebar = document.getElementsByTagName("aside")[0];

	if (sidebar) {
		return sidebar;
	}

	return createSidebar();
}

const sidebar = getSidebar();

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

	addSidebarItem({
		icon: "/static/img/icons/sidebar/home.svg",
		name: "Home",
		path: "/"
	}, locations_section);

	addSidebarItem({
		icon: "/static/img/icons/sidebar/documents.svg",
		name: "Documents",
		path: "/Documents"
	}, locations_section);

	const current_item = sidebarItemWithPath(current_path);
	if (current_item) {
		current_item.classList.add("selected");
	}

	return sidebar;
}
