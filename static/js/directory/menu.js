export function menuHandler(event) {
	return {
		"Open": () => event.target.dispatchEvent(new MouseEvent("dblclick")),
		"Remove": () => event.target.click(),
		"Rename": () => event.target.click(),
		"Download": () => event.target.click(),
	}
}
