import("./menu.js");

window.loadStylesheets = paths => {
	for (const path of paths) {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = path;
		document.head.appendChild(link);
	}
}

// TODO: Use exported function instead of window namespace

window.loadScript = (path, sri) => {
	const script = document.createElement("script");
	script.src = path;
	script.crossOrigin = "anonymous";
	script.referrerPolicy = "no-referrer";

	if (sri) {
		script.integrity = sri;
	}

	document.body.appendChild(script);

	return script;
}

fetch(`/data${window.path}`).then(async response => {
	if (!response.ok) {
		return import("./error.js").then(loader => loader.default(response.status));
	}

	const data = await response.json();

	if (data.type === "directory") {
		window.loadStylesheets(["/static/css/directory/popup.css"]);
		return import("./directory/index.js").then(loader => loader.default(data));
	}
	
	return import("./file/index.js").then(loader => loader.default(data));
});
