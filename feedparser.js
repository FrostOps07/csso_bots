// External Modules
var colors     = require('colors');     // color codes console output
var FeedParser = require('feedparser'); // for parsing feeds (For usage see: https://www.npmjs.com/package/feedparser)
var request    = require('request');    // for fetching feeds

// Internal Modules
const bot = require('./bot.js'); // Discord Bot
const db  = require('./db.js')   // Database files

/**
*   @function    initFeed()
*   @description Read an RSS feed and send each entry to a specified channel.
*
*   @input feed_address:string  RSS Feed URL to parse
*   @input channel_id:string    Discord Channel to send feed contents
*/
exports.initFeed = (feed_address, channel_id) => {
  var req        = request(feed_address);
  var feedparser = new FeedParser();

  req.on('error',    function(error) { throw new Error(error) });
  req.on('response', function(res)   {
    if (res.statusCode !== 200) { throw new Error("Bad status code returned on feed request.") }
    else { this.pipe(feedparser) }
  });

  feedparser.on('error',    function(error) { throw new Error(error) });
  feedparser.on('end',      function() { console.log(`Done parsing feed for ${this.meta.title}`) });
  feedparser.on('readable', function() {
    var stream = this;
    var meta   = this.meta;
    var item;
    while (item = stream.read()) {
      bot.sendMessage(`New episode of ${meta.title} found! ${item.title}`, channel_id);
    }
  });

}

/**
 *   @function    getNewest()
 *   @description Gets the newest item in a feed for the requested show.
 *   @input       feed_address:string - The feed of the show we want
 */
exports.getNewest = (feed_address, callback) => {
  console.log(`Getting newest item from ${feed_address}...`);

  var req        = request(feed_address);
  var feedparser = new FeedParser();
  var feed_items = 0; // Tally feed items found so we can stop looking after the first result comes through.

  req.on('error',    function (error) { throw new Error(error) });
  req.on('response', function (res)   {
    if (res.statusCode !== 200) { throw new Error("Bad status code returned on feed request.") }
    else { this.pipe(feedparser) }
  });

  feedparser.on('error',    function(error) { throw new Error(error) });
  feedparser.on('end',      function() { console.log(`Done parsing feed for ${this.meta.title}`) });
  feedparser.on('readable', function() {
    var stream = this;
    var meta   = this.meta;
    var item;
    while (item = stream.read()) {
      // If this is the first item in the feed, send it on over!
      if(feed_items == 0){
        callback({
          "meta":     meta,
          "item":     item,
          "feed_url": feed_address
        });
        feed_items++;
      }
    }
  });

}
