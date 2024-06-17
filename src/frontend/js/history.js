if (!sessionStorage.history) {
	sessionStorage.history = "[]";
}

const history = JSON.parse(sessionStorage.history);

if (history[history.length - 1] === window.path) {
	window.history_parsed = history;
} else {
	window.history_parsed = history.concat(window.path);
	sessionStorage.history = JSON.stringify(window.history_parsed);
}

window.history_parsed.pop = () => {
	sessionStorage.history = JSON.stringify(window.history_parsed.slice(0, -1));
	document.location = `/path${window.history_parsed[window.history_parsed.length - 2]}`;
}
