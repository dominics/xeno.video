import libdebug from "debug";

const debug = libdebug("xeno:actions:autoplay");

function attach(next, iframe) {
  debug("Got iframe, processing autoplay", iframe);
  const player = new window.playerjs.Player(iframe);

  player.on("ready", () => {
    debug("Player ready to start video");

    player.on("ended", () => {
      debug("Video ended");
      next();
    });

    player.play();
  });
}

/**
 * Handler that should be attached to the section that will contain the player
 *
 * @param {HtmlElement} section
 * @param {function} next
 */
export default (section, next) => {
  $(section)
    .find("iframe.embedly-embed")
    .each(function loop() {
      return attach(next, this);
    });

  debug("Done processing section");
};
