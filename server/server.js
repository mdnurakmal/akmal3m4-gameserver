const http = require('http');
const express = require('express');
const cors = require('cors');
const colyseus = require('colyseus');
const monitor = require("@colyseus/monitor").monitor;
// const socialRoutes = require("@colyseus/social/express").default;

const PokeWorld = require('./rooms/PokeWorld').PokeWorld;

const port = process.env.PORT || 8080;
const app = express()

let db = new Object();
let countries = new Object();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded()); // to support URL-encoded bodies

const server = http.createServer(app);
const gameServer = new colyseus.Server({
    server: server,
});

app.post('/test', (request, response) => {
    const sessionId = request.body.sessionId;
    var user_email = request.get('X-Goog-Authenticated-User-Email')
    var user_id = request.get('X-Goog-Authenticated-User-ID')
    var user_region = request.get('X-Client-Geo-Location')
    console.log(" i am from " + user_region);
    console.log("Helo" + user_email);
    console.log("Helo" + user_id);
    console.log("session id received:" + sessionId)
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.json({ "user_email": user_email,"user_region": user_region })

    countries[sessionId] = user_region;
    db[sessionId]= user_email.split("@")[0].split(":")[1];
  });

  app.get('/user', function(req, res){
    res.json({ username:  db[req.query.id] })

    console.log("returning " + db[req.query.id]);
  });


// register your room handlers
gameServer.define("poke_world", PokeWorld)
    .on("create", (room) => console.log("room created:", room.roomId))
    .on("dispose", (room) => console.log("room disposed:", room.roomId))
    .on("join", (room, client) => console.log(client.id, "joined", room.roomId))
    .on("leave", (room, client) => console.log(client.id, "left", room.roomId));

// ToDo: Create a 'chat' room for realtime chatting

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/authentication/)
 * - also uncomment the require statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor(gameServer));

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`)