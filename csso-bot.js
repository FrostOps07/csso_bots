var colors = require('colors');

const Discord = require("discord.js");
const client  = new Discord.Client();

const feed = require('./feedparser.js');

// Read bot credentials from a file and log in
const fs = require("fs"); // Use 'fs' to read the credentials file
let credentials = JSON.parse(fs.readFileSync('./client_key.json',"utf8"));
client.login(credentials.token);

/**
*   @function initBot
*
*   Creates an instance of the Discord bot. Should only be called on app startup.
*/
exports.initBot = () => {

  console.log("Bot initializing.".yellow);

  client.on("ready", () => {
    console.log("Bot ready!");
  });

  client.on("message", (message) => {
    if ( message.content.startsWith("!test") ) {
      message.channel.send("Reply!");
    }
    if ( message.content.startsWith("!rss") ) {
      feed.getData("sent this from the bot module", function(result){
        message.channel.send(result);
      });
    }
  });

};

/**
*   @function sendMessage
*   @input message:string     The message you want to send to Discord
*   @input channel_id:string  The ID of the channel you want the message to be sent to
*/
exports.sendMessage = (message, channel_id) => {
  client.on("ready", () => {
    // console.log(message, channel_id);
    var channel = client.channels.get(channel_id);
    channel.send(message);
  });
};
