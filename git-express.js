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
  var url_folders = req.originalUrl.split ('/')
  var commit_hash = url_folders[1]
  var path = url_folders[2]

  console.log ()

// Clone a given repository into a specific folder.
  clone(git_path, "docroot", null)
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
    .catch(function(err) { console.log(err); });
})

proxy.listen(3000)