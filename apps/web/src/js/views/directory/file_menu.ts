import { closePopup, createPopup } from "./popup";
import { createRenameInput } from "./edit";
import { getSelectedElements } from "./selection/modify";

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

function deleteFiles(filenames: string[]) {
	const requests: Promise<Response>[] = [];

	for (const filename of filenames) {
		const path = ensureSlashSuffix(current_path) + encodeURIComponent(filename);

		requests.push(fetch(path, {
			method: "DELETE"
		}));
	}

	Promise.all(requests).then(() => {
		document.location.reload();
	}).catch((error: unknown) => {
		console.error("Error in deleting files");
		throw error;
	});
}

export default function fileContextMenu(event: MouseEvent): MenuEntries {
	const menu = document.getElementById("menu");

	if (!menu || !event.target) {
		return [];
	}

	const file_button = getButtonFromEventTarget(event.target as HTMLElement);

	const menu_items: MenuEntries = [];

	const selected_items = getSelectedElements();
	const selected_count = selected_items.length;

	if (selected_count > 1) {
		menu_items.push(
			{
				classes: ["text"],
				display_name: `${selected_count} items`
			},
			{
				classes: ["space"]
			},
			{
				display_name: "Delete",
				pressed_callback: () => {
					const files: string[] = [];

					for (const item of selected_items) {
						const label = item.children[1] as HTMLElement;
						files.push(label.innerText);
					}

					createPopup(
						"",
						`Are you sure you want to delete ${selected_count} items?`,
						[
							{
								callback: closePopup,
								text: "Cancel"
							},
							{
								callback: () => {
									deleteFiles(files);
								},
								classList: ["continue"],
								text: "Confirm"
							}
						]
					);
				}
			},
			{
				classes: ["hr"]
			}
		);
	}

	menu_items.push(
		{
			classes: ["text", "space-bottom"],
			display_name: (file_button.children[1] as HTMLElement).innerText,
			id: "filename"
		},
		{
			classes: ["space"]
		},
		{
			display_name: "Delete",
			pressed_callback: () => {
				const filename = document.getElementById("filename").innerText;

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
								deleteFiles([filename]);
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
				const menu_title = document.getElementById("filename");
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
	);

	return menu_items;
}
