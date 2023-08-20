(function() {
	"use strict";

	var jsPath = getScriptLocation("uis-css-loader.js");
	let AppLibFiles = {

		CSS: {
			Ref : [

			],

			Core: [
				"lib/main.css",
				"lib/tingle.min.css",
			]
		}

	}
	var files;
	
	// css include
	files = AppLibFiles.CSS;
	for (var key in files) {
		var srcs = files[key];
		for (var idx=0; idx<srcs.length; idx++) {
			document.write("<link rel='stylesheet' type='text/css' href='" + jsPath + srcs[idx] + "'>");
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
