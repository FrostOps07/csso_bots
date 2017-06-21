/*
  index.js

  Run this file to start the Discord bot and all dependencies.
   
*/
var feed = require('./feedparser'),
    bot  = require('./csso-bot');

feed();
bot();
