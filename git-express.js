var CONFIG  = require("./config"),
    express = require('express'),
    open    = require("nodegit").Repository.open,
    proxy   = express()

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function parser (id, data) {
	return replaceAll ("href=\"/", "href=\"/" + id + "/", data);
}

function openDocroot (res, req, pull_callback, path, error_callback) {
  open(CONFIG.DOCROOT)
    .then(function(repo) {
      return pull_callback(repo);
    }).then(function(commit) {
      console.log ("detected")
      console.log ("Requested path: " + path)

      return commit.getEntry(path);
    }).then(function(entry) {
      process.stdout.write("Get blob ... ")
      return entry.getBlob().then(function(blob) {
        console.log ("detected")

        blob.entry = entry
        return blob
      });
      console.log ("detected")
    }).then(function(blob) {
      var id            = req.originalUrl.split ('/')[1],
          file_contents = String(blob)

      res.send(parser (id, file_contents))

      console.log ("Request closed")
    }).catch(function(err) {
      error_callback()

      res.send(err)
    })
}

proxy.use (function (req, res) {
  var url_folders = req.originalUrl.split ('/'),
      path        = url_folders.slice(2).join('/')

  var commit_callback = function (repo) {
    var commit_hash = url_folders[1]

    process.stdout.write("Commit request: " + commit_hash + " ... ")

    return repo.getCommit(commit_hash)
  }

  var branch_callback = function (repo) {
    var branch_name = url_folders[1]

    process.stdout.write("Branch request: " + branch_name + " ... ")
    
    return repo.getReferenceCommit("origin/" + branch_name)
  }

  console.log ()

  openDocroot (res, req, commit_callback, path,          // try loading file via commit hash
    openDocroot (res, req, branch_callback, path, null)  // try loading file via branch name
  )
})

proxy.listen(CONFIG.PORT)
