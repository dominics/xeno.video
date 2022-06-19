import { Strategy as RedditStrategy } from "passport-reddit";
import libdebug from "debug";

const debug = libdebug("xeno:session:strategy");

export default (config) => new RedditStrategy(
    {
      clientID: config.REDDIT_CONSUMER_KEY,
      clientSecret: config.REDDIT_CONSUMER_SECRET,
      callbackURL: `${config.HOST  }/callback`,
      scope: config.REDDIT_OAUTH_SCOPE,
    },
    (accessToken, refreshToken, profile, done) => {
      const data = {
        accessToken,
        refreshToken,
        authenticated: Date.now() / 1000,
        reddit: profile,
      };

      process.nextTick(() => done(null, data));
    }
  );
