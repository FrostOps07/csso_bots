const Discord = require("discord.js");
const client = new Discord.Client();

// Read bot credentials from a file
const fs = require("fs");
let credentials = JSON.parse(fs.readFileSync('./client_key.json',"utf8"));

client.login(credentials.token);

client.on("ready", () => {
  console.log("I am ready!");

  // Grab the MwM channel on server start and send a message to it
  var channel = client.channels.get("326893762049736704");
  channel.send("MwM channel?");

});

client.on("message", (message) => {
  if ( message.content.startsWith("!test") ) {
    message.channel.send("Reply!");
  }

});

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'file.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {

      // .open will NOT return a value but simply returns undefined in async mode so use a callback
      callback(xobj.responseText);

    }
  }
  xobj.send(null);
}
