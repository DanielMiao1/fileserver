import current_path from "../path.js";

type FSDirReader = FileSystemDirectoryReader;
type FSEntriesPromise = Promise<FileSystemEntry[]>;

function affixSlash(path: string) {
	return path.endsWith("/") ? path : `${path}/`;
}

async function uploadTransferItem(file: File, path: string) {
	const reader = new FileReader();

	return await new Promise(resolve => {
		reader.addEventListener("load", event => {
			if (event.target) {
				void fetch(affixSlash(current_path) + encodeURI(path), {
					body: event.target.result,
					headers: {
						type: "file"
					},
					method: "POST"
				}).then(resolve);
			}
		});

		reader.readAsText(file);
	});
}

async function createFileFromEntry(entry: FileSystemFileEntry): Promise<File> {
	return await new Promise(resolve => {
		entry.file(resolve);
	});
}

async function readDirectoryEntries(reader: FSDirReader): FSEntriesPromise {
	return await new Promise(resolve => {
		reader.readEntries(resolve);
	});
}

async function readAllDirectoryEntries(reader: FSDirReader): FSEntriesPromise {
	const entries = [];
	let current_entries = await readDirectoryEntries(reader);

	while (current_entries.length > 0) {
		entries.push(...current_entries);
		current_entries = await readDirectoryEntries(reader);
	}

	return entries;
}

async function uploadDirectory(entry: FileSystemDirectoryEntry) {
	await fetch(affixSlash(current_path) + encodeURI(entry.fullPath.slice(1)), {
		headers: {
			type: "directory"
		},
		method: "POST"
	});

	const entries = await readAllDirectoryEntries(entry.createReader());

	for (const subentry of entries) {
		if (subentry.isDirectory) {
			await uploadDirectory(subentry as FileSystemDirectoryEntry);
		} else {
			const file = await createFileFromEntry(subentry as FileSystemFileEntry);
			await uploadTransferItem(file, subentry.fullPath.slice(1));
		}
	}
}

async function parseDroppedItems(items: DataTransferItemList) {
	for (const item of items) {
		if (item.kind === "file") {
			const entry = item.webkitGetAsEntry();

			if (!entry) {
				return;
			}

			if (entry.isDirectory) {
				await uploadDirectory(entry as FileSystemDirectoryEntry);
			} else {
				const file = item.getAsFile();

				if (file) {
					await uploadTransferItem(file, file.name);
				}
			}
		}
	}

	document.location.reload();
}

export function prepareUploadElement() {
	document.addEventListener("dragenter", event => {
		event.preventDefault();
		event.stopPropagation();
	}, true);

	document.addEventListener("dragover", event => {
		event.preventDefault();
		event.stopPropagation();
	}, true);

	document.addEventListener("dragleave", event => {
		event.preventDefault();
		event.stopPropagation();
	}, true);

	document.addEventListener("drop", (event: DragEvent) => {
		event.preventDefault();
		event.stopPropagation();

		if (event.dataTransfer) {
			void parseDroppedItems(event.dataTransfer.items);
		}
	}, true);
}
