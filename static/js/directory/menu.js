export function menuHandler(event) {
	return {
		"Open": () => event.target.dispatchEvent(new MouseEvent("dblclick")),
		"Delete": () => fetch({method: "DELETE"}),
		"Rename": () => event.target.click(),
		"Download": () => event.target.click(),
	}
}
