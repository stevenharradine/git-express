var CONFIG = require("./config")
var clone = require("nodegit").Clone.clone

  clone(CONFIG.GIT_PATH, CONFIG.DOCROOT, null)
    .catch(function(err) {
    	console.log(err)
    })