import { createNewDirectoryInput } from "./edit";

import { type MenuEntries } from "../../components/menu";

export default function globalContextMenu(): MenuEntries {
	return [
		{
			display_name: "New Directory",
			pressed_callback: createNewDirectoryInput
		},
		{
			display_name: "Reload",
			pressed_callback: () => {
				document.location.reload();
			}
		}
	];
}
