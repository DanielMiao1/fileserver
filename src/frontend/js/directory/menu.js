function applyRename(old_filename) {
	let enclosing_directory = document.location.pathname;
	if (!enclosing_directory.endsWith("/")) {
		enclosing_directory += "/";
	}

	const old_path = enclosing_directory.slice(5) + old_filename;
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

// eslint-disable-next-line max-lines-per-function
function createRenameInput(target) {
	const old_filename = target.children[0].innerText;

	const input_element = document.createElement("input");
	input_element.value = old_filename;
	input_element.id = "rename";
	target.prepend(input_element);
	target.children[1].remove();

	input_element.focus();
	input_element.selectionStart = old_filename.length;

	const listener_signal = new AbortController();

	document.getElementsByTagName("main")[0].addEventListener("mousedown", event => {
		if (event.target !== target && event.target.parentNode !== target) {
			if (old_filename === input_element.value) {
				const span_element = document.createElement("span");
				span_element.innerText = old_filename;
				target.prepend(span_element);
				target.children[1].remove();

				listener_signal.abort();
			} else {
				applyRename(old_filename);
			}
		}
	}, {
		signal: listener_signal.signal
	});

	input_element.addEventListener("keydown", event => {
		if (event.key === "Enter") {
			if (old_filename === input_element.value) {
				listener_signal.abort();

				const span_element = document.createElement("span");
				span_element.innerText = old_filename;
				target.prepend(span_element);
				target.children[1].remove();
			} else {
				applyRename(old_filename);
			}
		} else if (event.key === "Escape") {
			event.preventDefault();
			listener_signal.abort();

			const span_element = document.createElement("span");
			span_element.innerText = old_filename;
			target.prepend(span_element);
			target.children[1].remove();
		}

		return false;
	});
}

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
			fetch(ensureSlashSuffix(window.path) + encodeURIComponent(event.target.title), {
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
