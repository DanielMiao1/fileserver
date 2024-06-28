function affixSlash(path) {
	return path.endsWith("/") ? path : `${path}/`;
}

async function uploadFile(transfer_item, entry) {
	const file = transfer_item.getAsFile();
	const reader = new FileReader();

	return await new Promise(resolve => {
		reader.addEventListener("load", event => {
			fetch(affixSlash(window.path) + encodeURIComponent(entry.name), {
				body: event.target.result,
				method: "POST"
			}).then(resolve);
		});
	
		reader.readAsText(file);
	});
}

async function parseDroppedItems(items) {
	for (let index = 0; index < items.length; index++) {
		if (items[index].kind === "file") {
			const entry = "getAsEntry" in DataTransferItem.prototype ? items[index].getAsEntry() : items[index].webkitGetAsEntry();

			if (!entry.isDirectory) {
				await uploadFile(items[index], entry);
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

	document.addEventListener("drop", async event => {
		event.preventDefault();
		event.stopPropagation();

		await parseDroppedItems(event.dataTransfer.items);

		return false;
	}, true);
}
