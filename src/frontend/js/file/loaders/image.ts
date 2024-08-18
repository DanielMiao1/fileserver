export default function load(source: string): HTMLImageElement {
	void import("../../../css/file/loaders/image.scss");

	const image_element = document.createElement("div");
	image_element.classList.add("image");
	image_element.style.setProperty("--image", `url("${source}")`);

	const image = new Image();
	image.addEventListener("error", () => {
		const error = document.createElement("p");
		error.innerText = "Failed to load image";
		image_element.appendChild(error);
	});
	image.src = source;
	return image_element;
}
