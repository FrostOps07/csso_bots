var colors = require('colors');

const Discord = require("discord.js");
const client  = new Discord.Client();

const feed = require('./feedparser.js');
// const feeds = require("./feeds.json");
const feeds = require("./feeds-dev.json");

// Read bot credentials from a file and log in
const fs = require("fs"); // Use 'fs' to read the credentials file
let credentials = JSON.parse(fs.readFileSync('./client_key.json',"utf8"));
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
    if ( message.content.startsWith("!test") ) {
      message.channel.send("Reply!");
    }
    if ( message.content.startsWith("!rss") ) {
      message.channel.send("What, me, RSS?");
    }
    if ( message.content.startsWith("!dyk") ) {
      message.channel.send(":dyk:");
    }
    if ( message.content.startsWith("!emote") ) {
      message.channel.send("<:bit:327641127413088256><:bit:327641127413088256><:bit:327641127413088256>");
    }
    // Find the newest episode for the current channel!
    // Searches for as many feeds as this channel is associated with.
    if ( message.content.startsWith("!new") ) {
      var channel_id  = message.channel.id;
      var feed_urls   = [];
      // Look up the feed_url that correlates to this channel
      for (var i = 0; i < feeds.length; i++) {
        // Add the feed URL if it matches the channel ID, OR if the channel is "general"
        if(feeds[i].channel_id == channel_id || channel_id == "324563443279724545" || channel_id == "325292818547605505"){
          feed_urls.push(feeds[i].feed_url);
        }
      }
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
