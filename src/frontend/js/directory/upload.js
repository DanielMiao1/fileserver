function affixSlash(path) {
	return path.endsWith("/") ? path : `${path}/`;
}

function parseDroppedItems(items) {
	for (let index = 0; index < items.length; index++) {
		if (items[index].kind !== "file") {
			continue;
		}

		const entry = "getAsEntry" in DataTransferItem.prototype ? items[index].getAsEntry() : items[index].webkitGetAsEntry();

		if (entry.isDirectory) {
			// TODO: Uplaod directory contents
			continue;
		};

		const file = items[index].getAsFile();
		const reader = new FileReader();

		reader.addEventListener("load", async event => {
			await fetch(affixSlash(window.path) + encodeURIComponent(entry.name), {
				method: "POST",
				body: event.target.result
			});
		});

		reader.readAsText(file);
	}

	document.location.reload();
}

export function prepareUploadElement() {
	document.addEventListener("dragenter", event => {
		event.preventDefault();
		event.stopPropagation();
		return false;
	}, true);
	
	document.addEventListener("dragover", event => {
		event.preventDefault();
		event.stopPropagation();
		return false;
	}, true);
	
	document.addEventListener("dragleave", event => {
		event.preventDefault();
		event.stopPropagation();
		return false;
	}, true);

	document.addEventListener("drop", event => {
		event.preventDefault();
		event.stopPropagation();

		parseDroppedItems(event.dataTransfer.items);

		return false;
	}, true);
}
