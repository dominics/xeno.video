export default class Store {
  constructor() {
    this.name = null;
  }

  _multi(url) {
    return new Promise((resolve, reject) => {
      $.getJSON(url).then(
        (data) => resolve(this._payload(data)),
        (xhr, status, err) => reject(xhr, status, err)
      );
    });
  }

  _payload(data) {
    return data[this.name];
  }
}