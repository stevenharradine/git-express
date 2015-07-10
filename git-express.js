var express = require('express')
var Git = require("nodegit")
var app = express()

/*Git.Clone("https://github.com/stevenharradine/git-express.git", "docroot").then(function(repository) {
  // Work with the repository object here.
});
*/

var getMostRecentCommit = function(repository) {
  return repository.getBranchCommit("master");
};

var getCommitMessage = function(commit) {
  return commit.message();
};

app.get('/', function (req, res) {
  

  Git.Repository.open("docroot")
    .then(getMostRecentCommit)
    .then(getCommitMessage)
    .then(function(message) {
      res.send(message)
    });
})

app.listen(3000)