var colors = require('colors');

var FeedParser = require('feedparser');
var request    = require('request'); // for fetching the feed

const bot  = require('./csso-bot.js');

/**
*   Initialize RSS feed reader.
*
*   @input feed_address:string  RSS Feed URL to watch
*   @input channel_id:string    Discord Channel to post updates to
*/
exports.initFeed = (feed_address, channel_id) => {
  // Call this object for all requests to the CSSO channel.
  var req        = request(feed_address);
  var feedparser = new FeedParser();

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

  // This function will run for every feed item it finds!
  feedparser.on('readable', function () {
    // This is where the action is!
    var stream = this;    // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item;

    while (item = stream.read()) {
      var message = "New episode of "+meta.title+" found! " + item.title;
      // console.log(message);
      bot.sendMessage(message, channel_id); // Sends the found item to the appropriate discord channel
    }
  });

}

exports.getData = (data, callback) => {
  callback(data+", calling back?");
}
