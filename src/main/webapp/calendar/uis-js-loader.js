(function() {
	"use strict";

	let jsPath = getScriptLocation("uis-js-loader.js");
	let AppLibFiles = {

		JS: {
			Ref : [

			],

			Core : [
				"lib/main.js",
				"lib/tingle.min.js",
				"js/utils/clipboard.js",
				"js/custumer.js",
				"js/adminPage.js",
				"lib/locales-all.js",
				"js/theme-chooser.js",

			]

		}

	}
	let files;

	
	// js include
	files = AppLibFiles.JS;
	const VERSION = new Date().getTime();
	for (var key in files) {
		var srcs = files[key];
		if(key != "Fclty"){
			for (var idx=0; idx<srcs.length; idx++) {
			document.write("<script src='" + jsPath + srcs[idx] + "'></script>");
			//document.write("<script src='" + jsPath + srcs[idx] + '?v=' + VERSION + "'></script>");
			}
		}
	}

	function getScriptLocation(scriptName) {
		var regExp = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)");
		var scripts = document.getElementsByTagName("script");
		for (var i = 0; i < scripts.length; i++) {
			var src = scripts[i].getAttribute("src");
			if (src) {
				var match = src.match(regExp);
				if (match) {
					return match[1];
				}
			}
		}
		return null;
	}

})();
