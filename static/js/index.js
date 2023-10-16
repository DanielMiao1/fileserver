import("/static/js/menu.js");
import("/static/js/history.js");

window.loadStylesheets = paths => {
	for (const path of paths) {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = path;
		document.head.appendChild(link);
	}
}

fetch("/data" + window.path).then(async response => {
	if (!response.ok) {
		return import("/static/js/error.js").then(loader => loader.default(response.status));
	}

	const data = await response.json();

	if (data.type == "directory") {
		import("/static/js/directory/index.js").then(loader => loader.default(data));
	} else {
		import("/static/js/file/index.js").then(loader => loader.default(data));
	}
});
