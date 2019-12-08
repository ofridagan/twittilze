// for making http request and stream the response
const hyperquest = require('hyperquest');

// json stream parsing
const ndjson = require('ndjson');

// our topper-stream for calculation 'top' values
const topper = require('./topperStream');

// tweats parsers
const {getWords, getUsers, getHashtags, getTweetsCount} = require('./tweatParsers');

const { Transform } = require('stream');

// creates a stream which recieves tweats and outputs string values, using the function provided
const makeValuesStream = (tweetToValues) => {
  return new Transform({
    objectMode:true,

    transform(tweet, encoding, callback) {
      (tweetToValues(tweet) || []).forEach((word) => {
        this.push(word);
      });
      callback();
    }
  });
};

const statsMiddleware = (streamUrl) => {

  // a stream of tweats coming from the web and parsed before passing on to the next stream
  const tweets =  hyperquest(streamUrl).pipe(ndjson.parse());

  // stream of tweats ==> stream from tweats to values ==> stream from values to 'top' list
  const topWords = tweets.pipe(makeValuesStream(getWords)).pipe(topper(10));
  const topUsers = tweets.pipe(makeValuesStream(getUsers)).pipe(topper(10));
  const topHashtags = tweets.pipe(makeValuesStream(getHashtags)).pipe(topper(10));
  const tweetsCount = tweets.pipe(makeValuesStream(getTweetsCount)).pipe(topper(1)); // yeah I don't really need a topper just to count.. but it works

  // marking the time for tweats-frequency calculation
  const start = new Date();
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
