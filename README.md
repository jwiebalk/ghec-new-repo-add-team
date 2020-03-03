# Auto add team to new Repositories

Node.js app that listens for `Repository.create` webhooks from a GitHub Enterprise Cloud organization and adds a specified team to that repository.

## Build the image

* Build the image locally

```
git clone https://github.com/jwiebalk/ghec-new-repo-add-team.git
cd ghec-new-repo-add-team
sudo docker build --rm=true -t ghec-new-repo-add-team .
```

* Export needed environment variables

```
export SECRET=<webhook secret>
export GHE_TOKEN=<site admin token>
export GHE_TEAM_NAME=<team name to be added>
export GHE_TEAM_ACCESS=<pull,push,admin>
```

* Run container

```
sudo docker run -d -p 3000:3000 -e GHE_TOKEN=$GHE_TOKEN -e SECRET=$SHARED_SECRET -e GHE_TEAM_NAME=$GHE_TEAM_NAME -e GHE_TEAM_ACCESS=$GHE_TEAM_ACCESS -t ghec-new-repo-add-team
```

You can then check the `docker logs $container` to see webhook status
