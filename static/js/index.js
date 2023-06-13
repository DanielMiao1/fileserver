import("/static/js/menu.js")

fetch("/raw" + window.path).then(data => data.json()).then(data => {
	if (data.type == "directory") {
		import("/static/js/directory/index.js").then(directory => directory.default(data.data));
	}
});
