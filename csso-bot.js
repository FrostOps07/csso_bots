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
    // Message is a command
    if( message.content.startsWith("!")){
      // Data we will need to reference
      var msg_array  = message.content.split(" ");
      var channel_id = message.channel.id;
      var command    = msg_array[0];
      var user_roles = [];
      // Check for roles with access to this command
      var roles_with_permission = db.rolesWithPermission(command);
      var has_permission = false;
      // Check if this user has a role with permission
      for (var i = 0; i < roles_with_permission.length; i++) {
        if(message.member.roles.has(roles_with_permission[i].id)){
          has_permission = true;
          user_roles.push(roles_with_permission[i].id);
        }
      }
      // Client has permission! Do the thing they asked.
      if(has_permission == true){
        if ( command == "!commands"){
          var command_list = db.getCommands(user_roles);
          var command_list_message = "*Here are the commands you are able to use:* \n\n";
          for (var i = 0; i < command_list.length; i++) {
            command_list_message += "**"+command_list[i].command+":** "+command_list[i].description+"\n";
          }
          message.channel.send(command_list_message);
        }
        if ( command == "!test") {
          message.channel.send("Reply!");
        }
        if ( command == "!dyk") {
          // Grab a random DYK fact
          var random_dyk    = db.getDYK();
          var dyk_prefix    = "";
          if(random_dyk.dyk_type != undefined){
            dyk_prefix = random_dyk.dyk_type;
          }
          var dyk_content   = random_dyk.dyk;
          var dyk_link      = random_dyk.videoLink;
          var dyk_timestamp = random_dyk.timestamp;
          var dyk_name      = random_dyk.title;
          // Build the DYK message
          if(random_dyk.source != "twitch"){
            var dyk_message = "<:dyk:324633372217573377> **" + dyk_prefix + " BUT DID YOU KNOW???** <:dyk:324633372217573377> \n\n" + dyk_content + "\n\n From **" + dyk_name + ":** <" + dyk_link + "&t="+dyk_timestamp + ">";
          }
          // Send that shit
          message.channel.send(dyk_message);
        }
        if ( command == "!new") {
          // Get the channel id the request was sent from
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
          else if(feed_urls.length == 1){
            feed.getNewest(feed_urls[0], function(result){
              var episode_link = result.item.link;
              var this_feed    = db.getFeedFromURL(feed_urls[0]);
              var show_name    = this_feed.name;
              var data = "Here's the newest episode of "+show_name+"! \n\n"+episode_link;
              message.channel.send(data);
            });
          }
          // Channel is spamhalla, send the newest one from each feed
          else if(channel_id == "eventually, spamhalls"){//"324587903759941632"){
          }
          // Otherwise, compare all the feeds!
          else{
            compareFeeds(feed_urls, function(data){
              message.channel.send(data);
            });
          }
        }
      }
      else{
        message.channel.send("Hey you! You're not allowed to use `"+command+"`!");
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
        var this_feed    = db.getFeedFromURL(feed_data[0].feed_url);
        var episode_link = feed_data[0].item.link;
        var show_name    = this_feed.name;
        // Feeds are the same show
        if(db.compareFeeds(feed_urls) == true){
          // Create message
          var data = "Here's the latest episode of "+show_name+"! \n\n"+episode_link;
          callback(data);
        }
        // Feeds are different shows, post CSSO text
        else{
          var data = "Here's the latest release from Chainsawsuit Originals!\n\n"+episode_link;
          callback(data);
        }
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
