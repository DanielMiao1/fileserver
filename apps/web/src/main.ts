import route from "./routing";
import loadFile from "./file/view";
import loadDirectory from "./directory/view";

import "./index.scss";

import {
	isFile,
	listDirectory
} from "./api";

void isFile(route).then(is_file => {
	if (is_file) {
		loadFile({});
	} else {
		void listDirectory(route).then(dir_items => {
			loadDirectory(dir_items);
		});
	}
});
