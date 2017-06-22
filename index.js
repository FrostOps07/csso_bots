/*
  index.js

  Run this file to start the Discord bot and all dependencies.

*/
// Grab the modules we will be using
var colors = require('colors');
const feed = require('./feedparser.js');
const bot  = require('./csso-bot.js');

// Variables for ease of access
const base_playlist_url = "https://www.youtube.com/feeds/videos.xml?playlist_id=";

console.log("Starting CSSO bot.");

// First we initialize the Discord Bot
bot.initBot();

// Then we initialize an RSS feed listener for each show: (feed ID, channel ID)
console.log("Listening for new Movies with Mikey episodes...".yellow);
// feed.initFeed(base_playlist_url+"PLdGl5mi0XeW2iK2sVp2ni_VDRKrmfF_-Z", "326893762049736704");

console.log("Listening for new PortsCenter episodes...".red);
// feed.initFeed(base_playlist_url+"PLdGl5mi0XeW2f3re8q6C7fUGjYFtQltyu", "326893844664811520");

console.log("Listening for new Local58 episodes...".grey);
// feed.initFeed(base_playlist_url+"PLdGl5mi0XeW0rOb8Ahw4L3kGflHJ9IdqF", "326893865565028352");

// console.log("Listening for new 28 Plays Later episodes...");
// feed.initFeed(base_playlist_url+"PLdGl5mi0XeW1rBxwI5JdcstHXHrKKeNJP", "no_channel_yet");

// console.log("Listening for new C3S episodes...");
// feed.initFeed(base_playlist_url+"PLdGl5mi0XeW3myi_yJGE89H8wPV-jJYPK", "no_channel_yet");
