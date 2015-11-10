/**
 * globals: io
 */

module.exports = () => {
  const ws = io.connect(window.location.host);
  return ws;
};
