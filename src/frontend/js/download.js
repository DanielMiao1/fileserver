export function initiateDownloader() {
	const iframe = document.createElement("iframe");
	iframe.id = "downloader"
	iframe.style.display = "none";
	document.body.appendChild(iframe);
	return iframe;
};
