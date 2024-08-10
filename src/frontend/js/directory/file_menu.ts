import { closePopup, createPopup } from "./popup.js";
import { createRenameInput } from "./edit.js";

import path from "../path";

function ensureSlashSuffix(path) {
	return path.endsWith("/") ? path : `${path}/`;
}

function truncate(text, length=10) {
	let result = text;

	if (result.length >= length) {
		result = `${result.slice(0, length)}...`;
	}

	return result;
}

function getButtonFromEventTarget(target) {
	if (["P", "SPAN", "FIGURE", "IMG"].includes(target.nodeName)) {
		return target.parentNode;
	}

	return target;
}

function deleteFile(filename) {
	fetch(ensureSlashSuffix(path) + encodeURIComponent(filename), {
		method: "DELETE"
	}).then(response => {
		if (response.ok) {
			document.location.reload();
		}
	});
}

export default function fileContextMenu(event) {
	return {
		[getButtonFromEventTarget(event.target).children[1].innerText]: [
			false,
			"text separator-bottom"
		],
		Delete: [() => {
			const filename = document.getElementById("menu").children[0].innerText;

			createPopup(
				false,
				`Are you sure you want to delete ${truncate(filename)}?`,
				[
					{
						callback: closePopup,
						text: "Cancel"
					},
					{
						callback: () => deleteFile(filename),
						classList: ["continue"],
						text: "Confirm"
					}
				]
			);
		}],
		Download: [() => {
			document.getElementById("downloader").src = `/download${path}/${encodeURIComponent(event.target.title)}`
		}],
		// TODO: Properly open the file
		Open: [() => getButtonFromEventTarget(event.target).dispatchEvent(new MouseEvent("dblclick"))],
		Rename: [() => createRenameInput(getButtonFromEventTarget(event.target))]
	}
}
