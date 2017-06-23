// Import external modules
var colors    = require('colors');     // Color codes console output
const fs      = require("fs");         // To read the credentials file
const Discord = require("discord.js"); // The bot
const client  = new Discord.Client();

// Import internal modules
const feed = require('./feedparser.js'); // For parsing RSS feeds
const db   = require('./db.js');         // Database files

// Read bot credentials from a file and log in
let credentials = JSON.parse(fs.readFileSync('./db/client_key.json',"utf8"));
client.login(credentials.token);

/**
*   @function initBot
*   Creates an instance of the Discord bot. Should only be called on app startup.
*/
exports.initBot = () => {

  console.log("Bot initializing.".yellow);

  client.on("ready", () => {
    console.log("Bot ready!");
  });

  client.on("message", (message) => {
    var role_id = "327868906964516864"; // Role ID of message sender

    if ( message.content.startsWith("!commands") && db.hasPermission(role_id,"!commands")){
      var command_list = db.getCommands(message)
      message.channel.send(command_list);
    }
    if ( message.content.startsWith("!test") && db.hasPermission(role_id,"!test")) {
      message.channel.send("Reply!");
    }
    if ( message.content.startsWith("!dyk") && db.hasPermission(role_id,"!dyk")) {
      message.channel.send("<:dyk:324633372217573377>");
    }
    if ( message.content.startsWith("!new") && db.hasPermission(role_id,"!new")) {
        // Get the channel id the request was sent from
        var channel_id  = message.channel.id;
        var feed_urls   = [];
        // Look through all feeds
        for (var i = 0; i < db.table.feeds.length; i++) {
          // In each feed, look for all channel ids
          for (var j = 0; j < db.table.feeds[i].channel_ids.length; j++) {
            // If the channel the reqest was sent from matches the id for this feed, add it!
            if(channel_id == db.table.feeds[i].channel_ids[j]){
              feed_urls.push(db.table.feeds[i].feed_url);
            }
          }
        }
        // Remove any duplicate feed entries so we don't parse the same feeds multiple times
        feed_urls = feed_urls.filter(function(item, pos) {
            return feed_urls.indexOf(item) == pos;
        });
        // Send error if no feeds found, else get the newest item for each feed
        if(feed_urls.length == 0){
          message.channel.send("No feeds found for this channel."+ feed_urls);
        }
        // Don't bother comparing feeds if there's only one!
        if(feed_urls.length == 1){
          feed.getNewest(feed_urls[0], function(result){
            var show_name    = result.meta.title;
            var episode_link = result.item.link;
            var data = "Here's the newest episode of "+show_name+"! \n"+episode_link;
            message.channel.send(data);
          });
        }
        // Otherwise, compare all the feeds!
        else{
          compareFeeds(feed_urls, function(data){
            message.channel.send(data);
          });
        }
      }
  });
};

/**
*   @function compareFeeds
*   Looks at multiple RSS feeds, and calls back with the newest episode
*   @input feed_urls:array A list of feed URLs
*/
function compareFeeds(feed_urls, callback){
  console.log("Finding the newest episode within the following "+feed_urls.length+" feeds.");
  // Array of feed responses
  var feed_data   = [];
  // Get newest item from each feed found
  for (var i = 0; i < feed_urls.length; i++) {
    feed.getNewest(feed_urls[i], function(result){
      feed_data.push(result);
      // Once we have gotten the newest episode from each feed...
      if(feed_urls.length == feed_data.length){
        // Sort feed by date
        feed_data.sort(function(a, b) {
          a = new Date(a.item.pubdate);
          b = new Date(b.item.pubdate);
          return a>b ? -1 : a<b ? 1 : 0;
        });
        // Create message
        var show_name    = feed_data[0].meta.title;
        var episode_link = feed_data[0].item.link;
        var data = "Here's the newest episode of "+show_name+"! \n"+episode_link;
        callback(data);
      }
    });
  }
}

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
