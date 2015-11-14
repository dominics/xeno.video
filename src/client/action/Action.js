export default class Action {
  type = null;
  data = null;
  err = null;

  constructor(type, err = null, data = null) {
    this.type    = type;
    this.data    = data;
    this.err     = err;
    this.created = Date.now() / 1000;
  }

  get payload() {
    return this.isError() ? this.err : this.data;
  }

  isError() {
    return this.err !== null;
  }

  toString() {
    return `Action<${this.type}>${this.isError() ? '#ERR' : ''}${JSON.stringify(this.payload)}}`;
  }
}
