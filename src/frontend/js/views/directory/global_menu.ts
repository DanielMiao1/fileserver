import { createNewDirectoryInput } from "./edit";

import { type MenuEntries } from "../../components/menu";

export default function globalContextMenu(): MenuEntries {
	return {
		"New Directory": [createNewDirectoryInput],
		Reload: [() => {
			document.location.reload();
		}]
	};
}
