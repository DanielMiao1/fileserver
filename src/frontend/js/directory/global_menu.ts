import { createNewDirectoryInput } from "./edit.js";

export function menuHandler() {
	return {
		"New Directory": [createNewDirectoryInput],
		"Reload": [() => document.location.reload()]
	}
}
