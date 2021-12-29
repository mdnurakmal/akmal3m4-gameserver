import * as Colyseus from "colyseus.js";
import game from "./index.js";
/*================================================
| Array with current online players
*/
let db = new Object();
let countries = new Object();
let onlinePlayers = [];

/*================================================
| Colyseus connection with server
*/
var name = process.env.REGION;
document.getElementById("name").innerHTML = name;
var a = document.getElementById('dronelink'); //or grab it by tagname etc

if(name == "us-central1")
{
    a.href = "https://storage.cloud.google.com/dronegaga-game-assets-us/audio/drone1.mp3"
}
else if(name == "asia-southeast1")
{
    a.href = "https://storage.cloud.google.com/dronegaga-game-assets-asia/audio/drone1.mp3"
}

var client = new Colyseus.Client("wss://dronega.ga/authServer");


let room = client.joinOrCreate("poke_world").then(room => {

  
  fetch('https://dronega.ga/server/test', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({sessionId: room.sessionId})
  })
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
    console.log("hello from log");
    console.log(myJson);
    document.getElementById("player_name").innerHTML = myJson['user_email'].split("@")[0].split(":")[1];
    document.getElementById("user_region").innerHTML = myJson['user_region']
    db[room.sessionId]=myJson['user_email'].split("@")[0].split(":")[1];
    countries[room.sessionId]=myJson['user_region'];
  });


    console.log(room.sessionId, "joined", room.name);
    return room
}).catch(e => {
    console.log("JOIN ERROR", e);
});

// export function getPlayerName(sessionID) {

//   fetch('https://dronega.ga/server/user?id='+sessionID)
//   .then((response) => {
//     return response.json();
//   })
//   .then((myJson) => {
//     console.log("returnned " + myJson['username']);

//     this.game.data.set(sessionID,myJson['username']);
//     return myJson['username']
//   });

//   return "Null"
// }

export {onlinePlayers, room};

