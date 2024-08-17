import { createNewDirectoryInput } from "./edit.js";

import { type MenuEntries } from "../menu.js";

export default function globalContextMenu(): MenuEntries {
	return {
		"New Directory": [createNewDirectoryInput],
		Reload: [() => {
			document.location.reload();
		}]
	};
}
