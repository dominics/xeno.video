const React = require('react/addons');
const Strategy = require('./Strategy.jsx');

module.exports = class GeneralStategy extends Strategy {
  render(viewer, url) {
    const embedUrl = url;

    return (
      <iframe width="600" height="400" src={embedUrl} frameBorder="0" allowFullScreen></iframe>
    );
  }
};
