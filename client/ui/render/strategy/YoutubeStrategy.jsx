const GeneralStrategy = require('./GeneralStrategy.jsx');

module.exports = class YoutubeStrategy extends GeneralStrategy {
  render(viewer, url) {
    // @todo support #t fragments
    return super.render(viewer, url);
  }
};
