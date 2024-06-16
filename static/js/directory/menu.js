export function menuHandler(event) {
	return {
		"Open": () => event.target.dispatchEvent(new MouseEvent("dblclick")), // TODO: Properly open the file
		"Delete": () => fetch((
				document.location.pathname.endsWith("/") ?
				document.location.pathname :
				document.location.pathname + "/"
			) + event.target.title, {method: "DELETE"}
		).then(document.location.reload()),
		"Rename": () => event.target.click(),
		"Download": () => document.getElementById("downloader").src = (
			"/download" + (
				document.location.pathname.endsWith("/") ?
				document.location.pathname :
				document.location.pathname + "/"
			).slice(5) + event.target.title
		)
	}
}
