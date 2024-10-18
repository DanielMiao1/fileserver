export function loadScript(path: string, sri: string) {
	const script = document.createElement("script");
	script.src = path;
	script.crossOrigin = "anonymous";
	script.referrerPolicy = "no-referrer";

	if (sri) {
		script.integrity = sri;
	}

	document.body.appendChild(script);

	return script;
}
