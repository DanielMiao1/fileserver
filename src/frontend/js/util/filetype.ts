// TODO: Revise filetye descriptions (in JSON file)

let extensions: Record<string, string> | undefined;

async function getExtensionsMap(): Promise<Record<string, string>> {
	if (extensions) {
		return extensions;
	}

	const extensions_file = await fetch("/static/file_extensions.json");
	const json_data = extensions_file.json();

	return new Promise(resolve => {
		json_data.then(data => {
			extensions = data as Record<string, string>;
			resolve(extensions);
		}).catch(() => {
			throw new Error("Failed to retrieve extensions data");
		});
	});
}

export function hasExtension(filename: string) {
	return filename.includes(".");
}

export function extension(filename: string) {
	if (!hasExtension(filename)) {
		return "";
	}

	return filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
}

export default async function filetype(filename: string) {
	const format = extension(filename);

	if ((/^[0-9]{3}$/u).test(format)) {
		return "Split Archive";
	}

	if ((/^z[0-9]{2}$/u).test(format)) {
		return "Split Zip Archive";
	}

	const extensions_map = await getExtensionsMap();

	return extensions_map[extension(filename)] ?? "Document";
}
