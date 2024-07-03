import { createRenameInput } from "./edit.js";

function getButtonFromEventTarget(target) {
	if (["P", "SPAN"].includes(target.nodeName)) {
		return target.parentNode;
	}

	return target;
}

function ensureSlashSuffix(path) {
	return path.endsWith("/") ? path : `${path}/`;
}

export function menuHandler(event) {
	return {
		[getButtonFromEventTarget(event.target).children[0].innerText]: [
			false,
			"text separator-bottom"
		],
		Delete: [() => {
			const filename = document.getElementById("menu").children[0].innerText;
			
			fetch(ensureSlashSuffix(window.path) + encodeURIComponent(filename), {
				method: "DELETE"
			}).then(response => {
				if (response.ok) {
					document.location.reload();
				}
			});
		}],
		Download: [() => {
			document.getElementById("downloader").src = `/download${window.path}/${encodeURIComponent(event.target.title)}`
		}],
		// TODO: Properly open the file
		Open: [() => event.target.dispatchEvent(new MouseEvent("dblclick"))],
		Rename: [() => createRenameInput(getButtonFromEventTarget(event.target))]
	}
}
