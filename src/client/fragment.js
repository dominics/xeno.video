/**
 * Gets the current fragment, minus the # itself
 *
 * @returns {string}
 */
export function fragment() {
  return window.location.hash.substr(1);
}

/**
 * Parse the current fragment into a route
 *
 * @returns {{channel: boolean, item: boolean}}
 */
export function currentRoute() {
  const current = fragment();
  const parts = current.split("/");
  const route = { channel: false, item: false };

  if (parts.length === 1) {
    route.channel = parts[0];
  } else if (parts.length === 2) {
    route.channel = parts[0];
    route.item = parts[1];
  }

  return route;
}

/**
 * @param {string} channel
 * @param {string} item
 * @returns {string}
 */
export function build(channel, item = null) {
  return item !== null ? `${channel}/${item}` : `${channel}`;
}
