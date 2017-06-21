const Discord = require("discord.js");
const client = new Discord.Client();

client.login("YourKeyHere");

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

}
