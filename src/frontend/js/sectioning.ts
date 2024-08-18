function initializeMainElement(container: HTMLElement) {
	const main = document.createElement("main");
	container.appendChild(main);
	return main;
}

function initializeContainer() {
	const container = document.createElement("div");
	container.id = "container";
	document.body.appendChild(container);
	initializeMainElement(container);
	return container;
}

let container: HTMLElement;

if (document.getElementById("container")) {
	container = document.getElementById("container")!;
} else {
	container = initializeContainer();
}

let main: HTMLElement;

if (document.getElementsByTagName("main")[0]) {
	main = document.getElementsByTagName("main")[0]!;
} else {
	main = initializeMainElement(container);
}

export {
	container,
	main
};
