var express = require('express')
var clone = require("nodegit").Clone.clone;
var proxy = express()
var git_path = "https://github.com/stevenharradine/git-express.git"

var getMostRecentCommit = function(repository) {
  return repository.getBranchCommit(branch)
}

var getCommitMessage = function(commit) {
  return commit.message()
}

proxy.use (function (req, res) {
  var branch = req.originalUrl.substring (1)

// Clone a given repository into a specific folder.
  clone(git_path, "docroot", null)
    // Look up this known commit.
    .then(function(repo) {
      // Use a known commit sha from this repository.
      return repo.getCommit("e4ee311506fea83e02455f6cd14c931ade6f505e");
    })
    // Look up a specific file within that commit.
    .then(function(commit) {
      return commit.getEntry("README.md");
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
    .catch(function(err) { console.log(err); });
})

proxy.listen(3000)