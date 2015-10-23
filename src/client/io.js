/**
 * globals: io
 */

export default () => {
  const ws = io.connect(window.location.host);
  return ws;
};
