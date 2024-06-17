import("./menu.js");
import("./history.js");

window.loadStylesheets = paths => {
	for (const path of paths) {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = path;
		document.head.appendChild(link);
	}
}

fetch(`/data${window.path}`).then(async response => {
	if (!response.ok) {
		return import("./error.js").then(loader => loader.default(response.status));
	}

	const data = await response.json();

	if (data.type === "directory") {
		return import("./directory/index.js").then(loader => loader.default(data));
	}
	
	return import("./file/index.js").then(loader => loader.default(data));
});
