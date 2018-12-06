/**
*  index.js
*
*  Run this file to start the Discord bot!
*/

// External modules
var colors = require('colors');

// Internal modules
const bot  = require('./bot.js');
const feed = require('./feedparser.js');

const environment = process.env.NODE_ENV || 'development';

// Handle all errors
process.on('uncaughtException', function(err) {
  console.error('Caught Exception: '.red + err);
  let message = `Hey <@273490802305531904>, something broke! \n\`${err}\``;
  if(environment === 'development')
    bot.sendMessage(message, "350332449068154881"); // Dev Test Room
  else
    bot.sendMessage(message, "324930387166101504"); // FilmJoy Mod Room
});

// Initialize the Discord Bot
console.log(`Starting FilmJoy bot! Environment: ${environment}` );
bot.initBot();
