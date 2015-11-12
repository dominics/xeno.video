/**
 * @param url string
 * @param data object
 * @returns Promise
 */
export function getJSON(url, data) {
  return $.getJSON(url, data);
}
