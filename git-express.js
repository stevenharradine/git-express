var CONFIG    = require("./config"),
    express   = require('express'),
    open      = require("nodegit").Repository.open,
    webserver = express()

// taken from https://css-tricks.com/snippets/javascript/get-url-variables/ on 20150812 @ 05:00 EST
function getQueryVariable(query, variable) {
//       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

// taken from http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript on 20150812 @ 05:00 EST
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

webserver.use (function (req, res) {
  var url_folders    = req.originalUrl.split ('/'),
      location       = url_folders.slice(1).join('/'),
      location_split = location.split ('?'),
      path           = location_split[0],
      query_string   = location_split[1]

  var commit_callback = function (repo) {
    var commit_hash = getQueryVariable (query_string, "hash")

    process.stdout.write("Commit request: " + commit_hash + " ... ")

    return repo.getCommit(commit_hash)
  }

  var branch_callback = function (repo) {
    var branch_name = getQueryVariable (query_string, "branch")

    process.stdout.write("Branch request: " + branch_name + " ... ")
    
    return repo.getReferenceCommit("origin/" + branch_name)
  }

  console.log ()

  openDocroot (res, req, commit_callback, path,          // try loading file via commit hash
    openDocroot (res, req, branch_callback, path, null)  // try loading file via branch name
  )
})

webserver.listen(CONFIG.PORT)
