const extensions = {
	"aa": "Audible Audio Book",
	"aac": "AAC Audio",
	"ac3": "AC3 Audio",
	"ai": "Adobe Illustrator Artwork",
	"app": "macOS Application Bundle",
	"asm": "Assembly Source File",
	"au": "Audacity Audio",
	"avchd": "AVCHD Video",
	"avif": "AV1 Image",
	"awk": "AWK Source File",
	"band": "Apple GarageBand Project",
	"bash": "Bash Shell Script",
	"bat": "DOS Batch File",
	"bin": "Binary File",
	"blend": "Blender 3D File",
	"bmp": "Microsoft Bitmap Image",
	"bundle": "macOS Plugin Bundle",
	"c": "C Source File",
	"class": "Java Class",
	"coffee": "CoffeeScript Source File",
	"component": "macOS System Component",
	"cpgz": "CPGZ Archive",
	"css": "CSS Source File",
	"csv": "Comma-Separated Values",
	"dat": "Application Data",
	"dll": "Dynamic Link Library",
	"ds_store": "Apple Desktop Services Store",
	"dv": "DV Video",
	"dylib": "Apple Dynamic Library",
	"erl": "Erlang Source File",
	"exr": "OpenEXR Image",
	"fileloc": "Internet File Location",
	"framework": "macOS Application Framework",
	"gcx": "Apple Graph File",
	"gif": "GIF Image",
	"go": "Go Source File",
	"inetloc": "Internet Location",
	"ino": "Arduino Source File",
	"jar": "Java Archive",
	"jxr": "JPEG-XR Image",
	"less": "CSS/LESS Source File",
	"log": "Log File",
	"m": "Objective-C Source File",
	"m2t": "HDV Video",
	"m3u": "MPEG-3 Playlist",
	"m4a": "MPEG-4 Audio",
	"m4b": "MPEG-4 Audiobook",
	"m4v": "Apple MPEG-4 Video",
	"mm": "Objective-C++ Source File",
	"mp2": "MPEG Layer 2 Audio",
	"mp3": "MPEG Layer 3 Audio",
	"mpo": "Multi Picture Object Image",
	"mscx": "MuseScore Score",
	"mscz": "MuseScore Compressed Score",
	"musicxml": "MusicXML Score",
	"mxl": "Compressed MusicXML Score",
	"o": "Compiled C Object File",
	"odc": "OpenDocument Chart",
	"odf": "OpenDocument Math Formula",
	"odg": "OpenDocument Graphics",
	"odi": "OpenDocument Image",
	"odm": "OpenDocument Master Document",
	"odt": "OpenDocument Text",
	"ogg": "OGG Audio",
	"otf": "OpenType Font",
	"pax": "PAX Archive",
	"pbm": "Portable Bitmap Image",
	"pdf": "PDF Document",
	"pgn": "Portable Game Notation File",
	"pictclipping": "Picture Clipping",
	"pkg": "Apple Software Package",
	"plist": "Property List",
	"plugin": "Plugin",
	"png": "PNG Image",
	"ppm": "Portable Pixmap Image",
	"ps": "PostScript Document",
	"ps1": "PowerShell Cmdlet",
	"psd": "Adobe Photoshop Document",
	"pub": "Public Key",
	"pug": "HTML/PUG Source File",
	"py": "Python Source File",
	"pyc": "Python Compiled File",
	"pyd": "Python Dynamic Module",
	"pyi": "Python Type Definitions",
	"pyo": "Optimized Python Compiled File",
	"pyw": "Pythonw GUI Source File",
	"qlgenerator": "Apple Quick Look Generator",
	"qtz": "Apple Quartz Composer Animation",
	"r": "R Source File",
	"rb": "Ruby Source File",
	"rdp": "Remote Desktop Configuration",
	"sass": "CSS/SASS Source File",
	"saver": "Apple Screen Saver",
	"scss": "CSS/SCSS Source File",
	"sea": "Self-Extracting Archive",
	"sh": "Shell Script",
	"smf": "Standard MIDI File",
	"smi": "Self-Mounting Disk Image",
	"sparseimage": "Apple Sparse Disk Image",
	"sql": "SQL Source File",
	"strings": "Text Strings",
	"svg": "Scalable Vector Graphics",
	"swift": "Swift Source File",
	"t": "Turing Source File",
	"tar": "TAR Archive",
	"tcl": "TCL Source File",
	"textclipping": "Text Clipping",
	"tsv": "Tab-Separated Values",
	"ttf": "TrueType Font",
	"ui": "User Interface Document",
	"url": "Internet Shortcut",
	"vb": "Visual Basic Source File",
	"vst": "VST Audio",
	"vst3": "VST3 Audio",
	"wacz": "Compressed Web Archive",
	"war": "Java Web Archive",
	"warc": "Web Archive",
	"wav": "Wave Audio",
	"webloc": "Apple Website Location",
	"webm": "WebM Video",
	"webp": "WebP Image",
	"wma": "Windows Media Audio",
	"xcode": "Xcode Project",
	"xml": "XML Document",
	"xsl": "XML Style Document",
	"z": "Z Archive",
	"zip": "Zip Archive",
	"zipx": "Extended Zip Archive",
	"zsh": "Zsh Shell Script",
}

export function hasExtension(filename) {
	return filename.includes(".");
}

export function extension(filename) {
	if (!hasExtension(filename)) {
		return false;
	}
	
	return filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
}


// eslint-disable-next-line complexity, max-statements, max-lines-per-function
export default function filetype(filename) {
	const format = extension(filename);
	
	if (/^[0-9]{3}$/u.test(format)) {
		return "Split Archive";
	}

	if (["3fr", "arw", "cr2", "cr3", "dng", "fff", "j6i", "mrw", "nef", "nrw", "raw", "orf", "srf", "sr2"].includes(format)) {
		return "Raw Image";
	}
	
	if (["123", "dif", "ods", "wk1", "wk2", "wk3", "wk4", "wk5", "wks", "xla", "xlam", "xlc", "xls", "xlsb", "xlsm", "xlsx", "xlt", "xlthtml", "xltm", "xltx", "xlw"].includes(format)) {
		return "Spreadsheet";
	}

	if (["action", "caction"].includes(format)) {
		return "Apple Automator Action";
	}

	if (["ada", "adb", "ads"].includes(format)) {
		return "Ada Source File";
	}

	if (["aif", "aifc", "aiff"].includes(format)) {
		return "AIFF Audio";
	}

	if (["applescript", "scpt"].includes(format)) {
		return "AppleScript Source File";
	}

	if (["c#", "cs", "csx"].includes(format)) {
		return "C# Source File";
	}

	if (["c++", "cc", "cp", "cpp", "cxx"].includes(format)) {
		return "C++ Source File";
	}

	if (["cer", "cert", "crt"].includes(format)) {
		return "Internet Certificate";
	}

	if (["cfg", "conf", "config", "ini"].includes(format)) {
		return "Configuration File";
	}

	if (["cur", "cursor"].includes(format)) {
		return "Cursor Image";
	}

	if (["db", "dbf", "sqlite", "sqlite3", "sqlitedb", "odb", "xld"].includes(format)) {
		return "Database File";
	}
	
	if (["dic", "dict", "dictionary"].includes(format)) {
		return "Dictionary File";
	}

	if (["diff", "patch"].includes(format)) {
		return "Patch File";
	}

	if (["doc", "dochtml", "docm", "docx", "dot", "dothtml", "dotm", "dotx"].includes(format)) {
		return "Microsoft Word Document";
	}

	if (["dmg", "img", "ndif"].includes(format)) {
		return "Disk Image";
	}

	if (["eml", "emlx"].includes(format)) {
		return "Email Message";
	}

	if (["epub", "ibooks"].includes(format)) {
		return "Electronic Publication eBook";
	}

	if (["exe", "exec"].includes(format)) {
		return "Executable";
	}

	if (["f", "f77", "f90", "f95", "for"].includes(format)) {
		return "Fortran Source File";
	}

	if (["gitignore", "ignore"].includes(format)) {
		return "Ignore List";
	}

	if (["gz", "gzip", "tgz"].includes(format)) {
		return "GZIP Archive";
	}

	if (["h", "h++", "hh", "hpp", "hxx"].includes(format)) {
		return "Fortran Source File";
	}

	if (["hdd", "qcow", "qcow2", "qed", "vdi", "vhd", "vhdx", "vmdk"].includes(format)) {
		return "Virtual Hard Disk File";
	}

	if (["hdd", "qcow", "qcow2", "qed", "vdi", "vhd", "vhdx", "vmdk"].includes(format)) {
		return "Virtual Hard Disk File";
	}

	if (["heic", "heif"].includes(format)) {
		return "HEIF Image";
	}

	if (["htm", "html"].includes(format)) {
		return "HTML Source File";
	}

	if (["icc", "icm"].includes(format)) {
		return "ICC Profile";
	}

	if (["icn", "icns", "ico", "icon"].includes(format)) {
		return "Icon Image";
	}

	if (["j", "jav", "java"].includes(format)) {
		return "Java Source File";
	}
	
	if (["j2c", "j2k", "jp2", "jpf"].includes(format)) {
		return "JPEG-2000 Image";
	}

	if (["javascript", "js", "jsx"].includes(format)) {
		return "JavaScript Source File";
	}

	if (["jpe", "jpeg", "jpg", "jpg-large", "jpg_large"].includes(format)) {
		return "JavaScript Source File";
	}

	if (["json", "jsonc", "jsonl"].includes(format)) {
		return "JSON Text";
	}

	if (["lisp", "lsp"].includes(format)) {
		return "Lisp Source File";
	}

	if (["m1v", "mpeg1"].includes(format)) {
		return "MPEG-1 Video";
	}

	if (["m2v", "m2p", "mp2v", "mpeg2"].includes(format)) {
		return "MPEG-2 Video";
	}

	if (["md", "mdx"].includes(format)) {
		return "Markdown Source File";
	}

	if (["mht", "mhtml"].includes(format)) {
		return "MIME/HTML Web Archive";
	}

	if (["mid", "midi"].includes(format)) {
		return "MIDI File";
	}

	if (["mlmodel", "mlmodelc"].includes(format)) {
		return "Apple ML Model";
	}

	if (["mov", "qt"].includes(format)) {
		return "Apple QuickTime Video";
	}

	if (["mp4", "mp4v", "mpeg4"].includes(format)) {
		return "MPEG-4 Video";
	}

	if (["mpe", "mpeg", "mpg"].includes(format)) {
		return "MPEG Video";
	}

	if (["odp", "pot", "potm", "potx", "ppa", "ppam", "pps", "ppsm", "ppsx", "ppt", "ppthtml", "pptm", "pptmhtml", "pptx"].includes(format)) {
		return "Presentation";
	}

	if (["pct", "pict"].includes(format)) {
		return "Picture File";
	}

	if (["perl", "pl", "pm"].includes(format)) {
		return "Perl Source File";
	}

	if (["php", "php2", "php3", "php4", "php5"].includes(format)) {
		return "PHP Source File";
	}

	if (["plain", "text", "txt"].includes(format)) {
		return "Plain Text Document";
	}

	if (["rest", "rst"].includes(format)) {
		return "reStructuredText Document";
	}

	if (["rtf", "rtfd"].includes(format)) {
		return "Rich Text Document";
	}

	if (["s", "src", "script"].includes(format)) {
		return "Source File";
	}

	if (["shtm", "shtml"].includes(format)) {
		return "Server-Side HTML Source File";
	}

	if (["tif", "tiff"].includes(format)) {
		return "TIFF Image";
	}

	if (["ts", "tsx"].includes(format)) {
		return "TypeScript Source File";
	}

	if (["txz", "xz"].includes(format)) {
		return "XZ Archive";
	}

	if (["vsd", "vsdm", "vsdx", "vss", "vssm", "vssx", "vstm", "vstx"].includes(format)) {
		return "Microsoft Visio Drawing";
	}

	if (["xhtm", "xhtml"].includes(format)) {
		return "Extensible HTML Document";
	}

	if (/^z[0-9]{2}$/u.test(format)) {
		return "Split Zip Archive"
	}
	
	return extensions[extension(filename)] ?? "Document";
}
