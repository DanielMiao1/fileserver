import { closePopup, createPopup } from "./popup";
import { createRenameInput } from "./edit";

import { type MenuEntries } from "../../components/menu";

import current_path from "../../util/path";

function ensureSlashSuffix(path: string) {
	return path.endsWith("/") ? path : `${path}/`;
}

function truncate(text: string, length = 10) {
	let result = text;

	if (result.length >= length) {
		result = `${result.slice(0, length)}...`;
	}

	return result;
}

function getButtonFromEventTarget(target: HTMLElement) {
	if (["P", "SPAN", "FIGURE", "IMG"].includes(target.nodeName)) {
		return target.parentNode as HTMLElement;
	}

	return target;
}

function deleteFile(filename: string) {
	fetch(ensureSlashSuffix(current_path) + encodeURIComponent(filename), {
		method: "DELETE"
	}).then(response => {
		if (response.ok) {
			document.location.reload();
		}
	}).catch(() => {
		document.location.reload();
	});
}

export default function fileContextMenu(event: MouseEvent): MenuEntries {
	const menu = document.getElementById("menu");

	if (!menu || !event.target) {
		return [];
	}

	const file_button = getButtonFromEventTarget(event.target as HTMLElement);

	return [
		{
			classes: ["text", "separator-bottom"],
			display_name: (file_button.children[1] as HTMLElement).innerText
		},
		{
			display_name: "Delete",
			pressed_callback: () => {
				const menu_title = menu.children[0] as HTMLElement;
				const filename = menu_title.innerText;

				// TODO: Rework createPopup options
				createPopup(
					"",
					`Are you sure you want to delete ${truncate(filename)}?`,
					[
						{
							callback: closePopup,
							text: "Cancel"
						},
						{
							callback: () => {
								deleteFile(filename);
							},
							classList: ["continue"],
							text: "Confirm"
						}
					]
				);
			}
		},
		{
			display_name: "Download",
			pressed_callback: () => {
				const menu_title = menu.children[0] as HTMLElement;
				const filename = encodeURIComponent(menu_title.innerText);

				const downloader = document.getElementById("downloader");
				downloader.src = `/download${current_path}/${filename}`;
			}
		},
		{
			display_name: "Open",
			pressed_callback: () => {
				// TODO: Create API to open the file
				const button = getButtonFromEventTarget(event.target);

				button.dispatchEvent(new MouseEvent("dblclick"));
			}
		},
		{
			display_name: "Rename",
			pressed_callback: () => {
				createRenameInput(getButtonFromEventTarget(event.target));
			}
		}
	];
}
