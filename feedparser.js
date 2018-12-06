// External Modules
var colors     = require('colors');     // color codes console output
var FeedParser = require('feedparser'); // for parsing feeds
var request    = require('request');    // for fetching feeds

// Internal Modules
const bot = require('./bot.js'); // Discord Bot
const db  = require('./db.js') // Database files

/**
*   @function initFeed()
*   Read an RSS feed and send each entry to a specified channel.
*
*   @input feed_address:string  RSS Feed URL to parse
*   @input channel_id:string    Discord Channel to send feed contents
*/
exports.initFeed = (feed_address, channel_id) => {
  // Call this object for all requests to the CSSO channel.
  var req        = request(feed_address);
  var feedparser = new FeedParser();

  req.on('error', function (error) {
    this.emit('error', new Error('Feed Request Error.'));
  });

  req.on('response', function (res) {
    var stream = this; // `this` is `req`, which is a stream

    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    }
    else {
      stream.pipe(feedparser);
    }
  });

  feedparser.on('error', function (error) {
    console.log("Feed Parser Error", error);
  });

  feedparser.on('end', function(){
    console.log("Done parsing feed for "+this.meta.title);
  });

  // This function will run for every feed item it finds!
  feedparser.on('readable', function () {
    // This is where the action is!
    var stream = this;    // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item;

    while (item = stream.read()) {
      var message = "New episode of "+meta.title+" found! " + item.title;
      bot.sendMessage(message, channel_id); // Sends the found item to the appropriate discord channel
    }
  });

}

/**
*   @function getNewest()
*
*   Gets the newest item in a feed for the requested show.
*   @input feed_address:  The feed of the show we want
*/
exports.getNewest = (feed_address, callback) => {
  // Call this object for all requests to the CSSO channel.
  var req        = request(feed_address);
  var feedparser = new FeedParser(); //{"addmeta":false});

  req.on('error', function (error) {
    console.log("Feed Request Error.".red,error);
  });

  req.on('response', function (res) {
    var stream = this; // `this` is `req`, which is a stream

    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    }
    else {
      stream.pipe(feedparser);
    }
  });

  feedparser.on('error', function (error) {
    console.log("Feed Parser Error", error);
  });

  feedparser.on('end', function(){
    console.log("Done parsing feed for "+this.meta.title);
  });

  var feed_items = 0;

  // This function will run for every feed item it finds!
  feedparser.on('readable', function () {
    // This is where the action is!
    var stream = this;    // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item;

    while (item = stream.read()) {
      // If this is the first item in the feed, send it on over!
      if(feed_items == 0){
        // Send first feed item back, and metadata for the feed
        callback({
          "meta":meta,
          "item":item,
          "feed_url":feed_address
        });
        feed_items++;
      }
    }
  });

}
