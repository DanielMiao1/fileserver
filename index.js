const express = require("express");
const fs = require("fs");
const fileUpload = require('express-fileupload');

const webapp = express();
webapp.use(express.static("imgs"))
webapp.use(express.text());
webapp.use(fileUpload({
	createParentPath: true
}));

const directory_root = "/store";

webapp.use("/download", express.static(directory_root))

webapp.listen(8192, function() {
	console.log("Started server on port 8192");
});

webapp.get("/", function(request, response) {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.set("Cache-Control", "no-store");
	response.sendFile(__dirname + "/index.html");
});

webapp.get("/actions/rename/:from/:to", function(request, response) {
	fs.renameSync(directory_root + request.params.from, directory_root + request.params.to);
	response.redirect("/");
});

webapp.get("/actions/delete/:path", function(request, response) {
	fs.unlinkSync(directory_root + request.params.path);
	response.redirect("/");
});

webapp.get("/actions/deletedir/:path", function(request, response) {
	fs.rmSync(directory_root + request.params.path, { recursive: true, force: true });
	response.redirect("/");
});

webapp.get("/actions/newdir/:path", function(request, response) {
	fs.mkdirSync(directory_root + request.params.path);
	response.redirect("/");
});

webapp.get("/actions/newfile/:path", function(request, response) {
	fs.writeFileSync(directory_root + request.params.path, "");
	response.redirect("/");
});

webapp.post("/actions/upload/:path", async (request, response) => {
	try {
		if (!request.files) {
			response.send({
				status: false,
				message: "No file selected"
			});
		} else {
			let file = request.files.file;
			file.mv(directory_root + "/" + (request.params.path.endsWith("/") ? request.params.path : request.params.path + "/") + file.name);
			response.redirect("/")
		}
	} catch (error) {
		response.status(500).send(error);
	}
});

webapp.post("/actions/write", function(request, response) {
	fs.writeFileSync(directory_root + request.headers["x-path"], request.body);
	response.redirect("/");
})

webapp.use(function(request, response) {
	response.status(404);
	response.redirect("/");
});
