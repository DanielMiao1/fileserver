function createMainElement(container: HTMLElement) {
	const main = document.createElement("main");
	container.appendChild(main);

	return main;
}

function createContainer() {
	const container = document.createElement("div");
	container.id = "container";

	createMainElement(container);

	document.body.appendChild(container);

	return container;
}

function getContainer() {
	const container = document.getElementById("container");

	if (container) {
		return container;
	}

	return createContainer();
}

const container = getContainer();

function getMainElement() {
	const main = document.getElementsByTagName("main")[0];

	if (main) {
		return main;
	}

	return createMainElement(container);
}

const main = getMainElement();

export {
	container,
	main
};
