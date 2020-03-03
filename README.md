# Auto add team to new Repositories

Nodejs app that listens for `Repository.create` webhooks from a GitHub Enterprise Server and adds a specified team to that repository.

## Build the image

* Configure wanted team access level at: https://github.com/jwiebalk/github-new-repo-add-team/blob/master/server.js#L12

* Build the image locally

```
git clone https://github.com/jwiebalk/github-new-org-admins.git
cd github-new-org-admins
sudo docker build --rm=true -t github-new-org-admins .
```

* Export needed environment variables

```
export SECRET=<webhook secret>
export GHE_HOST=<hostname>
export GHE_TOKEN=<site admin token>
export GHES_TEAM_NAME=<team name to be added>
```

* Run container

```
sudo docker run -d -p 3000:3000 -e GHE_HOST=$GHE_HOST -e GHE_TOKEN=$GHE_TOKEN -e SHARED_SECRET=$SHARED_SECRET -t github-new-repo-add-team
```

You can then check the `docker logs $container` to see webhook status

