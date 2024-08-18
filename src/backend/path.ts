import { resolve } from "path";

const serving_directory = process.env["DIRECTORY"] ?? "/store";

function ensureSlashPrefix(path: string) {
	return path.startsWith("/") ? path : `/${path}`;
}

export default function getScopedPath(
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
