export default function load(source) {
	import("../../../css/file/loaders/pdf.scss");

	const embed = document.createElement("embed");
	embed.src = source;
	return embed;
}
