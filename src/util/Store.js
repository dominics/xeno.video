export default class Store {
  constructor(request) {
    this.name = null;
    this.request = request;
  }

  _multi(url) {
    return new Promise((resolve, reject) => {
      this.request.getJSON(url).then(
        (data) => resolve(this._payload(data)),
        (xhr, status, err) => reject(err)
      );
    });
  }

  _payload(data) {
    return data[this.name];
  }
}
