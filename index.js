/*
  index.js

  Run this file to start the Discord bot and all dependencies.

*/
// Grab the modules we will be using
var colors = require('colors');

const feed = require('./feedparser.js');
const feeds = require("./feeds.json");

const bot  = require('./csso-bot.js');

// Variables for ease of access
const base_playlist_url = "https://www.youtube.com/feeds/videos.xml?playlist_id=";

console.log("Starting CSSO bot.");

// Initialize the Discord Bot
bot.initBot();

// Test getNewest and console.log the output
// feed.getNewest("https://www.youtube.com/feeds/videos.xml?playlist_id=PLdGl5mi0XeW0rOb8Ahw4L3kGflHJ9IdqF", function(result){console.log(result)});
