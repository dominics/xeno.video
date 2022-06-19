export default class Setting {
  id = null;

  value = null;

  pending = true;

  confirmed = false;

  constructor(id, value, pending = true, confirmed = false) {
    this.id = id;
    this.value = value;
    this.pending = pending;
    this.confirmed = confirmed;
  }

  setPending() {
    return new Setting(this.id, this.value, true, false);
  }

  setConfirmed() {
    return new Setting(this.id, this.value, false, true);
  }
}
