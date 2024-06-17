export function menuHandler(event) {
	return {
		Delete: () => fetch(`${(
			document.location.pathname.endsWith("/") ?
			document.location.pathname :
			`${document.location.pathname}/`
		)}${event.target.title}`, {
			method: "DELETE"
		}
	).then(response => {
		if (response.ok) {
			document.location.reload();
		}
	}),
		Download: () => {
			document.getElementById("downloader").src = `/download${(
				document.location.pathname.endsWith("/") ?
				document.location.pathname :
				`${document.location.pathname}/`
			).slice(5)}${event.target.title}`
		},
		// TODO: Properly open the file
		Open: () => event.target.dispatchEvent(new MouseEvent("dblclick")),
		Rename: () => event.target.click()
	}
}
