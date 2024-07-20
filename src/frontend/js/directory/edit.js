import { appendGridViewEntry, appendListViewEntry } from "./entry.js";

function applyRename(old_filename) {
	let enclosing_directory = window.path;
	if (!enclosing_directory.endsWith("/")) {
		enclosing_directory += "/";
	}

	const old_path = enclosing_directory + old_filename;
	const new_path = enclosing_directory + document.getElementById("rename").value;

	fetch(new_path, {
		headers: {
			path: old_path
		},
		method: "put"
	}).then(response => {
		if (response.ok) {
			document.location.reload();
		}
	});
}

function ensureSlashSuffix(path) {
	return path.endsWith("/") ? path : `${path}/`;
}

function requestNewDirectory(name) {
	fetch(ensureSlashSuffix(window.path) + name, {
		headers: {
			type: "directory"
		},
		method: "POST"
	}).then(response => {
		if (response.ok) {
			document.location.reload();
		}
	});
}

// eslint-disable-next-line max-lines-per-function
function createInput(target, finished_callback, aborted_callback) {
	const old_filename = target.children[1].innerText;

	const input_element = document.createElement("input");
	input_element.value = old_filename;
	input_element.id = "rename";
	target.children[1].after(input_element);
	target.children[1].remove();

	input_element.focus();
	input_element.selectionStart = old_filename.length;

	const listener_signal = new AbortController();

	document.getElementsByTagName("main")[0].addEventListener("mousedown", event => {
		if (event.target !== target && event.target.parentNode !== target) {
			if (old_filename === input_element.value) {
				if (typeof aborted_callback === "function") {
					aborted_callback(old_filename, false);
				}

				const span_element = document.createElement("span");
				span_element.innerText = old_filename;
				target.children[1].after(span_element);
				target.children[1].remove();

				listener_signal.abort();
			} else if (typeof finished_callback === "function") {
				finished_callback(old_filename);
			}
		}
	}, {
		signal: listener_signal.signal
	});

	input_element.addEventListener("keydown", event => {
		if (event.key === "Enter") {
			if (old_filename === input_element.value) {
				if (typeof aborted_callback === "function") {
					aborted_callback(old_filename, false);
				}

				listener_signal.abort();

				const span_element = document.createElement("span");
				span_element.innerText = old_filename;
				target.children[1].after(span_element);
				target.children[1].remove();
			} else if (typeof finished_callback === "function") {
				finished_callback(old_filename);
			}
		} else if (event.key === "Escape") {
			event.preventDefault();
			listener_signal.abort();

			const span_element = document.createElement("span");
			span_element.innerText = old_filename;
			target.children[1].after(span_element);
			target.children[1].remove();

			if (typeof aborted_callback === "function") {
				aborted_callback(old_filename, true);
			}
		}

		return false;
	});
}

export function createNewDirectoryInput() {
	const main = document.getElementsByTagName("main")[0];

	let directory_element;

	if (main.classList.contains("grid")) {
		directory_element = appendGridViewEntry("untitled directory", true);
	} else {
		directory_element = appendListViewEntry("untitled directory", true);
	}

	createInput(directory_element, () => {
		requestNewDirectory(document.getElementById("rename").value);
	}, (_, is_escape) => {
		if (is_escape) {
			return directory_element.remove();
		}
		
		return requestNewDirectory(document.getElementById("rename").value);
	});
}

export function createRenameInput(target) {
	return createInput(target, old_filename => {
		applyRename(old_filename);
	});
}

export default function isEditing() {
	return Boolean(document.getElementById("rename"));
}
