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

function createRenameInput(target) {
	if (target.nodeName === "P") {
		target = target.parentNode;
	}
	console.log(target)
	const old_filename = target.children[0].innerText;

	const input_element = document.createElement("input");
	input_element.value = old_filename;
	input_element.id = "rename";
	target.prepend(input_element);
	target.children[1].remove();

	input_element.focus();
	input_element.selectionStart = old_filename.length;

	input_element.addEventListener("keypress", event => {
		if (event.key === "Enter") {
			applyRename(old_filename);
		}
	})

	document.getElementsByTagName("main")[0].addEventListener("mousedown", event => {
		if (event.target !== target && event.target.parentNode !== target) {
			applyRename(old_filename);
		}
	}, true);
}

export function menuHandler(event) {
	return {
		Delete: () => fetch(
			`${(
				document.location.pathname.endsWith("/") ?
				document.location.pathname :
				`${document.location.pathname}/`
			)}${event.target.title}`,
			{
				method: "DELETE"
			}
		).then(response => {
			if (response.ok) {
				document.location.reload();
			}
		}),
		Download: () => {
			document.getElementById("downloader").src = `/download${(
				document.location.pathname.endsWith("/") ?
				document.location.pathname :
				`${document.location.pathname}/`
			).slice(5)}${event.target.title}`
		},
		// TODO: Properly open the file
		Open: () => event.target.dispatchEvent(new MouseEvent("dblclick")),
		Rename: () => createRenameInput(event.target)
	}
}
