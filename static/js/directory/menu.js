export function menuHandler(event) {
	return {
		"Open": () => event.target.dispatchEvent(new MouseEvent("dblclick")), // TODO: Properly open the file
		"Delete": () => fetch((
				document.location.pathname.endsWith("/") ?
				document.location.pathname :
				document.location.pathname + "/"
			) + event.target.title, {method: "DELETE"}
		),
		"Rename": () => event.target.click(),
		"Download": () => event.target.click(),
	}
}
