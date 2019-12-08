const hyperquest = require('hyperquest');
const ndjson = require('ndjson');
const fs = require('fs');
const topper = require('./topperStream');
const { Transform } = require('stream');

const getWords = new Transform({
  objectMode:true,

  transform(tweet, encoding, callback) {
    if (tweet.text) {
      tweet.text.split(' ').filter((word) => /\S/.test(word)).forEach((word) => {
        this.push(word);
      });
    }
    callback();
  }
});

const getUsers = new Transform({
  objectMode:true,

  transform(tweet, encoding, callback) {
    if (tweet.user) {
      this.push(tweet.user.screen_name);
    }
    callback();
  }
});

const getHashtags = new Transform({
  objectMode:true,

  transform(tweet, encoding, callback) {
    if (tweet.entities && tweet.entities.hashtags) {
      tweet.entities.hashtags.map((tag) => tag.text).forEach((word) => {
        this.push(word);
      });
    }
    callback();
  }
});

const getTweetsCount = new Transform({
  objectMode:true,

  transform(tweet, encoding, callback) {
    this.push('someConstantValue');
    callback();
  }
});

const statsMiddleware = (streamUrl) => {
  const start = new Date();

  const stream = hyperquest(streamUrl);
  //const stream = fs.createReadStream('./stream.json');

  const tweets = stream.pipe(ndjson.parse());
  const topWords = tweets.pipe(getWords).pipe(topper(10));
  const topUsers = tweets.pipe(getUsers).pipe(topper(10));
  const topHashtags = tweets.pipe(getHashtags).pipe(topper(10));
  const tweetsCount = tweets.pipe(getTweetsCount).pipe(topper(1));

  const tweetsFrequency = () => 1000 * tweetsCount.getTop()[0].count / (new Date() - start);

  return (ctx, next) => {
    ctx.stats = {
      topWords: topWords.getTop(),
      topUsers: topUsers.getTop(),
      topHashtags: topHashtags.getTop(),
      tweetsFrequency: tweetsFrequency()
    };
    next();
  }
}

module.exports = statsMiddleware;
