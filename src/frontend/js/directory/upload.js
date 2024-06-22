function affixSlash(path) {
	return path.endsWith("/") ? path : `${path}/`;
}

function uploadFile(transfer_item, entry) {
	const file = transfer_item.getAsFile();
	const reader = new FileReader();

	reader.addEventListener("load", async event => {
		await fetch(affixSlash(window.path) + encodeURIComponent(entry.name), {
			body: event.target.result,
			method: "POST"
		});
	});

	reader.readAsText(file);
}

function parseDroppedItems(items) {
	for (let index = 0; index < items.length; index++) {
		if (items[index].kind === "file") {
			const entry = "getAsEntry" in DataTransferItem.prototype ? items[index].getAsEntry() : items[index].webkitGetAsEntry();

			if (!entry.isDirectory) {
				uploadFile(items[index], entry);
			}
		}
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
