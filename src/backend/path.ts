import { resolve } from "path";

function getServingDirectory() {
	if (
		"DIRECTORY" in process.env &&
		typeof process.env["DIRECTORY"] === "string"
	) {
		return process.env["DIRECTORY"];
	}
	
	if (process.env["NODE_ENV"] !== "production") {
		return `${process.cwd()}/store`;
	}

	return "/store";
}

export const serving_directory = getServingDirectory();

function ensureSlashPrefix(path: string) {
	return path.startsWith("/") ? path : `/${path}`;
}

export function getScopedPath(
	relative_path: string,
	allow_root = false
) {
	const path = resolve(serving_directory + ensureSlashPrefix(relative_path));

	if (!path.startsWith(serving_directory)) {
		return false;
	}

	if (!allow_root && path.length === serving_directory.length) {
		return false;
	}

	return path;
}
