var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/webhook', secret: (process.env.SECRET)})

var dotcom = 'api.github.com'
var team_name = process.env.GHE_TEAM_NAME
var team_access = process.env.GHE_TEAM_ACCESS // pull,push,admin options here
var team_id = ""


http.createServer(function (req, res) {
  handler(req, res, function (err) {
    console.log(err)
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(3000)

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('repository', function (event) {

  if(event.payload.action == "created") {
    repo = event.payload.repository.full_name
    console.log(repo)
    org = event.payload.repository.owner.login
    getTeamID(org)
    setTimeout(checkTeamIDVariable, 1000);

  }
})

function getTeamID(org)
{

const https = require('https')

const options = {
  hostname: dotcom,
  port: 443,
  path: '/orgs/' + org + "/teams",
  method: 'GET',
  headers: {
    'Authorization': 'token ' + (process.env.GHE_TOKEN),
    'Content-Type': 'application/json',
    'User-Agent': 'NodeJS'
  }
}
let body = [];
const req = https.request(options, (res) => {
  res.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = JSON.parse(Buffer.concat(body))
        body.forEach(item => {
          if (item.name == team_name) {
            team_id = item.id
          }

       })
    })

})

req.on('error', (error) => {
  console.error(error)
})

req.end()

}

function checkTeamIDVariable() {

   if (typeof team_id !== "undefined") {
       addTeamToRepo(repo, team_id)
   }
}

function addTeamToRepo(repo, team_id)
{

const https = require('https')
const data = JSON.stringify({
  permission: team_access
})

const options = {
  hostname: dotcom,
  port: 443,
  path: '/teams/'+ team_id + '/repos/' + repo,
  method: 'PUT',
  headers: {
    'Authorization': 'token ' + (process.env.GHE_TOKEN),
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'User-Agent': 'NodeJS'
  }
}
let body = [];
const req = https.request(options, (res) => {
  res.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log(res.statusCode)
        console.log("added team to " + repo)
    })

})

req.on('error', (error) => {
  console.error(error)
})

 req.write(data)
req.end()

}
