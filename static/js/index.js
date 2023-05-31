fetch("/raw" + window.path).then(data => data.json()).then(data => {
	if (data.type == "directory") {
		import("/static/js/directory.js").then(directory => directory.default(data.data));
	}
});
