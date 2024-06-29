function affixSlash(path) {
	return path.endsWith("/") ? path : `${path}/`;
}

async function uploadTransferItem(file, path) {
	const reader = new FileReader();

	return await new Promise(resolve => {
		reader.addEventListener("load", event => {
			fetch(affixSlash(window.path) + encodeURI(path), {
				body: event.target.result,
				headers: {
					type: "file"
				},
				method: "POST"
			}).then(resolve);
		});
	
		reader.readAsText(file);
	});
}

async function createFileFromEntry(entry) {
	try {
		return await new Promise((resolve, reject) => {
			entry.file(resolve, reject);
		});
	} catch (error) {
		console.error(error); // TODO: Create UI element to handle errors
	}
}

async function readDirectoryEntries(reader) {
	try {
		return await new Promise((resolve, reject) => {
			reader.readEntries(resolve, reject);
		});
	} catch (error) {
		console.error(error);
	}
}

async function readAllDirectoryEntries(reader) {
	let entries = [];
	let current_entries = await readDirectoryEntries(reader);
	while (current_entries.length > 0) {
		entries.push(...current_entries);
		current_entries = await readDirectoryEntries(reader);
	}
	return entries;
}

async function uploadDirectory(entry) {
	await fetch(affixSlash(window.path) + encodeURI(entry.fullPath.slice(1)), {
		headers: {
			type: "directory"
		},
		method: "POST"
	});

	let entries = await readAllDirectoryEntries(entry.createReader());
	
	for (const subentry of entries) {
		if (subentry.isDirectory) {
			await uploadDirectory(subentry);
		} else {
			const file = await createFileFromEntry(subentry);
			await uploadTransferItem(file, subentry.fullPath.slice(1));
		}
	}
}

async function parseDroppedItems(items) {
	for (let index = 0; index < items.length; index++) {
		if (items[index].kind === "file") {
			const entry = "getAsEntry" in DataTransferItem.prototype ? items[index].getAsEntry() : items[index].webkitGetAsEntry();

			if (entry.isDirectory) {
				await uploadDirectory(entry);
			} else {
				const file = items[index].getAsFile();
				await uploadTransferItem(file, file.name);
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
