export default function load(source: string): HTMLEmbedElement {
	import("../../../../css/file/loaders/pdf.scss").catch((error: unknown) => {
		console.error(error);
		throw new Error("Failed to load css file");
	});

	const embed = document.createElement("embed");
	embed.src = source;
	return embed;
}
