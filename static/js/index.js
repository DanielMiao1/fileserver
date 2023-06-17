import("/static/js/menu.js");
import("/static/js/history.js")

window.loadStylesheets = paths => {
	for (const path of paths) {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = path;
		document.head.appendChild(link);
	}
}

fetch("/data" + window.path).then(data => data.json()).then(data => {
	if (data.type == "directory") {
		import("/static/js/directory/index.js").then(directory => directory.default(data));
	} else {
		import("/static/js/file/index.js").then(file => file.default(data));
	}
});
