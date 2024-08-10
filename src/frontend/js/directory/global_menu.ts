import { createNewDirectoryInput } from "./edit.js";

export default function globalContextMenu() {
	return {
		"New Directory": [createNewDirectoryInput],
		"Reload": [() => document.location.reload()]
	}
}
