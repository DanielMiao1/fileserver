export default function load(source: string): HTMLImageElement {
	import("../../../css/file/loaders/image.scss").catch((error: unknown) => {
		console.error(error);
		throw new Error("Failed to load css file");
	});

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
