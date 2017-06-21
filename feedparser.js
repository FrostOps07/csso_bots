var colors = require('colors');

var FeedParser = require('feedparser');
var request    = require('request'); // for fetching the feed

// Call this object for all requests to the CSSO channel.
var req        = request('https://www.youtube.com/feeds/videos.xml?channel_id=UCEtB-nx5ngoNJWEzYa-yXBg')
var feedparser = new FeedParser();

function feedModule(){

  console.log("Feed Module started.".red);

  req.on('error', function (error) {
    console.log("Feed Request Error.",error);
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

  feedparser.on('readable', function () {
    // This is where the action is!
    var stream = this; // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item;

    while (item = stream.read()) {
      console.log(item);
    }
  });

}

module.exports = feedModule;
