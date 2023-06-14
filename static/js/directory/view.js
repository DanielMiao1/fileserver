import select, { multi_select, initiateDragSelection} from "/static/js/directory/selection.js";

if (!localStorage.directory_view) {
	localStorage.directory_view = "grid";
}

const container = document.getElementsByTagName("main")[0];

function createGridView(items) {
	window.loadStylesheets(["/static/css/directory/grid.css"]);
	container.classList.add("grid");

	for (const [item, type] of Object.entries(items)) {
		const button = document.createElement("button");
		button.title = item;
		button.dataset.menu = "/static/js/directory/menu.js"

		if (type) {
			button.classList.add("directory");
		}

		if (item.startsWith(".")) {
			button.classList.add("hidden");
		} else if (!type && item.includes(".")) {
			button.classList.add("file-" + item.slice(item.lastIndexOf(".") + 1).toLowerCase())
		}

		button.addEventListener("mousedown", function(event) {
			if (event.button === 1) {
				return;
			}

			select(this, multi_select);
		});

		button.addEventListener("dblclick", function() {
			document.location = (
				document.location.pathname.endsWith("/") ?
				document.location.pathname :
				document.location.pathname + "/"
			) + item;
		});

		const text_container = document.createElement("span");
		text_container.innerText = item;
		button.appendChild(text_container);

		container.appendChild(button);
	}

	initiateDragSelection();
}

function createListView(items) {
	window.loadStylesheets(["/static/css/directory/list.css"]);
	container.classList.add("list");
	const list = document.createElement("ul");

	for (const [item, type] of Object.entries(items)) {
		const row = document.createElement("li")
		row.dataset.menu = "/static/js/directory/menu.js"
		if (type) {
			row.classList.add("directory");
		}
		if (item.startsWith(".")) {
			row.classList.add("hidden");
		} else if (!type && item.includes(".")) {
			row.classList.add("file-" + item.slice(item.lastIndexOf(".") + 1).toLowerCase())
		}

		row.addEventListener("mousedown", function(event) {
			if (event.button === 1) {
				return;
			}

			select(this, multi_select);
		});

		row.addEventListener("dblclick", function() {
			document.location = (
				document.location.pathname.endsWith("/") ?
				document.location.pathname :
				document.location.pathname + "/"
			) + item;
		});
		
		const filename = document.createElement("p");
		filename.innerText = item;
		filename.title = item;


		row.appendChild(filename);
		list.appendChild(row);
	}

	container.appendChild(list);
}

export default function createDirectoryView(items) {
	if (localStorage.directory_view === "grid") {
		createGridView(items);
	} else {
		createListView(items);
	}
}
