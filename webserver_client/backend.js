express = require("express");
fs = require("fs");

const root_directory = "/Users/mac/shared";
const webapp = express();

webapp.listen(18950, function() {
	console.log("Started backend server on port 18950");
});

webapp.get("*", function(request, response) {
	console.log("GET " + request.url);
  response.setHeader("Content-Security-Policy", "default-src *");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.set("Cache-Control", "no-store");
	let path = root_directory + request.url;
	if (fs.existsSync(path)) {
		if (fs.statSync(path).isDirectory()) {
			let files = {};
			for (let x of fs.readdirSync(path)) {
				files[x] = {
					"directory": fs.statSync((path.endsWith("/") ? path : path + "/") + x).isDirectory()
				};
			};
			response.json({"type": "directory", "content": files});
		} else {
      response.json({"type": "file", "content": fs.readFileSync(path, "utf8")});
    };
	};
});
