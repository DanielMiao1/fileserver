export default function load(source: string): HTMLEmbedElement {
	void import("../../../css/file/loaders/pdf.scss");

	const embed = document.createElement("embed");
	embed.src = source;
	return embed;
}
