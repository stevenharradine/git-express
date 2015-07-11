var CONFIG = require("./config")
var express = require('express')
var open = require("nodegit").Repository.open
var proxy = express()

proxy.use (function (req, res) {
  var url_folders = req.originalUrl.split ('/')
  var commit_hash = url_folders[1]
  var path = url_folders.slice(2).join('/')

  console.log (path)

  open(CONFIG.DOC_ROOT)
    // Look up this known commit.
    .then(function(repo) {
      // Use a known commit sha from this repository.
      return repo.getCommit(commit_hash);
    })
    // Look up a specific file within that commit.
    .then(function(commit) {
      return commit.getEntry(path);
    })
    // Get the blob contents from the file.
    .then(function(entry) {
      // Patch the blob to contain a reference to the entry.
      return entry.getBlob().then(function(blob) {
        blob.entry = entry;
        return blob;
      });
    })
    // Display information about the blob.
    .then(function(blob) {
      res.send(String(blob));
    })
    .catch(function(err) {
    	console.log(err)

    	if (commit_hash == "master") {
		  open("docroot")//, "docroot", null)
		    // Look up this known commit.
		    .then(function(repo) {
		      // Use a known commit sha from this repository.
		      return repo.getBranchCommit("master");
		    })
		    // Look up a specific file within that commit.
		    .then(function(commit) {
		      return commit.getEntry(path);
		    })
		    // Get the blob contents from the file.
		    .then(function(entry) {
		      // Patch the blob to contain a reference to the entry.
		      return entry.getBlob().then(function(blob) {
		        blob.entry = entry;
		        return blob;
		      });
		    })
		    // Display information about the blob.
		    .then(function(blob) {
		      res.send(String(blob));
		    })
		    .catch(function(err) {
		    	console.log(err)
		    })
    	}
      console.log(err)
    })
})

proxy.listen(3000)