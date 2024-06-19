export function prepareUploadElement() {
	const file_upload = document.createElement("input");
	file_upload.multiple = true;
	file_upload.type = "file";
	file_upload.id = "file";
	file_upload.name = "file";

	const file_upload_wrapper = document.createElement("form");
	file_upload_wrapper.method = "post";
	file_upload_wrapper.enctype = "multipart/form-data";

	file_upload_wrapper.appendChild(file_upload);
	document.body.appendChild(file_upload_wrapper);
}
