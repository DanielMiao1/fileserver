import { appendGridViewEntry, appendListViewEntry } from "./entry.js";
import { main } from "../sectioning.js";

import current_path from "../path.js";

function applyRename(old_filename: string) {
	let enclosing_directory = current_path;
	if (!enclosing_directory.endsWith("/")) {
		enclosing_directory += "/";
	}

	const rename_element = document.getElementById("rename") as HTMLInputElement;
	const new_filename = rename_element.value;

	const old_path = enclosing_directory + old_filename;
	const new_path = enclosing_directory + new_filename;

	fetch(new_path, {
		headers: {
			path: old_path
		},
		method: "put"
	}).then(response => {
		if (response.ok) {
			document.location.reload();
		}
	}).catch(() => {
		document.location.reload();
	});
}

function ensureSlashSuffix(path: string) {
	return path.endsWith("/") ? path : `${path}/`;
}

function requestNewDirectory(name: string) {
	fetch(ensureSlashSuffix(current_path) + name, {
		headers: {
			type: "directory"
		},
		method: "POST"
	}).then(response => {
		if (response.ok) {
			document.location.reload();
		}
	}).catch(() => {
		document.location.reload();
	});
}

function createInput(
	target: HTMLElement,
	finished_callback?: (old_filename: string) => void,
	aborted_callback?: (old_filename: string, is_escape: boolean) => void
) {
	const filename_label = target.children[1] as HTMLElement;
	const old_filename = filename_label.innerText;

	const input_element = document.createElement("input");
	input_element.value = old_filename;
	input_element.id = "rename";
	filename_label.after(input_element);
	filename_label.remove();

	input_element.focus();
	input_element.selectionStart = old_filename.length;

	const listener_signal = new AbortController();

	main.addEventListener("mousedown", event => {
		if (event.target !== target && event.target.parentNode !== target) {
			if (old_filename === input_element.value) {
				if (aborted_callback) {
					aborted_callback(old_filename, false);
				}

				const span_element = document.createElement("span");
				span_element.innerText = old_filename;
				target.children[1].after(span_element);
				target.children[1].remove();

				listener_signal.abort();
			} else if (finished_callback) {
				finished_callback(old_filename);
			}
		}
	}, {
		signal: listener_signal.signal
	});

	input_element.addEventListener("keydown", event => {
		if (event.key === "Enter") {
			if (old_filename === input_element.value) {
				if (aborted_callback) {
					aborted_callback(old_filename, false);
				}

				listener_signal.abort();

				const span_element = document.createElement("span");
				span_element.innerText = old_filename;
				target.children[1].after(span_element);
				target.children[1].remove();
			} else if (finished_callback) {
				finished_callback(old_filename);
			}
		} else if (event.key === "Escape") {
			event.preventDefault();
			listener_signal.abort();

			const span_element = document.createElement("span");
			span_element.innerText = old_filename;
			target.children[1].after(span_element);
			target.children[1].remove();

			if (aborted_callback) {
				aborted_callback(old_filename, true);
			}
		}
	});
}

export function createNewDirectoryInput() {
	let directory_element;

	if (main.classList.contains("grid")) {
		directory_element = appendGridViewEntry("untitled directory", true);
	} else {
		directory_element = appendListViewEntry("untitled directory", true);
	}

	createInput(directory_element, () => {
		const rename_element = document.getElementById("rename") as HTMLInputElement;
		requestNewDirectory(rename_element.value);
	}, (_, is_escape: boolean) => {
		if (is_escape) {
			directory_element.remove();
		} else {
			const rename_element = document.getElementById("rename") as HTMLInputElement;
			requestNewDirectory(rename_element.value);
		}
	});
}

export function createRenameInput(target: HTMLElement) {
	createInput(target, (old_filename: string) => {
		applyRename(old_filename);
	});
}

export default function isEditing() {
	return Boolean(document.getElementById("rename"));
}
