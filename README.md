# git-express
A web server that hosts git repositories and serves the site at any point in time.

## Setup

### update config
point `module.exports.GIT_PATH` to your repo.

```module.exports.GIT_PATH = "https://github.com/stevenharradine/simple-site.git"```

### clone repo

```node init```

### start the server

#### Crontab (Recommended)

```echo "@reboot cd /home/ubuntu/git-express/ && node git-express.js" >> /var/spool/cron/crontabs/ubuntu```

#### Manual

```node git-express```

### update the docroot

```cd docroot && git pull```