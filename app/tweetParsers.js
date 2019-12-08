// Methods in this file are the only place we deal with the actual tweets.
// Every method takes a tweet and extract the wanted values from it.

const getWords = (tweet) => {
  if (tweet.text) {
    return tweet.text.split(' ').filter((word) => /\S/.test(word))
  }
};

const getUsers = (tweet) => {
  if (tweet.user) {
    return [tweet.user.screen_name];
  }
};

const getHashtags = (tweet) => {
  if (tweet.entities && tweet.entities.hashtags) {
    return tweet.entities.hashtags.map((tag) => tag.text)
  }
};

// surely there is simpler way to count the tweets,
// but I couldn't resist counting them in the same way as the others, as a "top 1" list of a single value.
const getTweetsCount = () => ['someConstantValue'];

module.exports = {getWords, getUsers, getHashtags, getTweetsCount};
