/**
*  index.js
*
*  Run this file to start the Discord bot!
*/

// External modules
var colors = require('colors');
// Internal modules
const bot  = require('./csso-bot.js');
const feed = require('./feedparser.js');

// Initialize the Discord Bot
console.log("Starting FilmJoy bot.");
bot.initBot();
