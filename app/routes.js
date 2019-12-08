const router = new (require('koa-router'))();

const respondFromStats = (name) => {
  return (ctx) => {
    ctx.body = ctx.stats[name]
  }
};

router.get('/words', respondFromStats('topWords'));
router.get('/users', respondFromStats('topUsers'));
router.get('/hashtags', respondFromStats('topHashtags'));
router.get('/tweets', respondFromStats('tweetsFrequency'));

module.exports = router.routes();
