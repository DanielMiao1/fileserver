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

	// TODO: Revise filetye descriptions (in JSON file)

	const extensions_file = await fetch("/static/file_extensions.json");
	const extensions = await extensions_file.json() as Record<string, string>;

	return extensions[extension(filename)] ?? "Document";
}
