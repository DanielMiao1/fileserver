import { closePopup, createPopup } from "./popup.js";
import { createRenameInput } from "./edit.js";

import { type MenuEntries } from "../menu.js";

import current_path from "../path.js";

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

	if (!menu) {
		return {};
	}

	return {
		[getButtonFromEventTarget(event.target).children[1].innerText]: [
			false,
			"text separator-bottom"
		],
		Delete: [() => {
			const menu_title = menu.children[0] as HTMLElement;
			const filename = menu_title.innerText;

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
		}],
		Download: [() => {
			const menu_title = menu.children[0] as HTMLElement;
			const filename = encodeURIComponent(menu_title.innerText);

			const downloader = document.getElementById("downloader");
			downloader.src = `/download${current_path}/${filename}`;
		}],
		// TODO: Properly open the file
		Open: [() => {
			const button = getButtonFromEventTarget(event.target);

			button.dispatchEvent(new MouseEvent("dblclick"));
		}],
		Rename: [() => {
			createRenameInput(getButtonFromEventTarget(event.target));
		}]
	};
}
