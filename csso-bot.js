var colors = require('colors');

const Discord = require("discord.js");
const client  = new Discord.Client();

// Read bot credentials from a file
const fs = require("fs");
let credentials = JSON.parse(fs.readFileSync('./client_key.json',"utf8"));

exports.initBot = () => {

  console.log("Bot initializing.".yellow);

  client.login(credentials.token);

  client.on("ready", () => {
    console.log("I am ready!".blue);

    const channel = client.channels.get("");


  });

  client.on("message", (message) => {
    if ( message.content.startsWith("!test") ) {
      message.channel.send("Reply!");
    }
    if ( message.content.startsWith("!rss") ) {
      message.channel.send("");
    }
  });

};

exports.sendMessage = (message) => {
  // TODO: Doesn't work yet, need to be able to call this from the feed parser!
  // client.channel.send("sendMessage Function");
};
