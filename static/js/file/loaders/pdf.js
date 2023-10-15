export default async function load(source) {
	window.loadStylesheets(["/static/css/file/loaders/pdf.css"]);

	const embed = document.createElement("embed");
	embed.src = source;
	return embed;
}
