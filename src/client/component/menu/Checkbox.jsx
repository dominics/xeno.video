import { default as React, Component } from "react";
import types from "./../../action/types";
import registry from "./../../action";
import Setting from "./../../setting/Setting";
import libdebug from "debug";

const debug = libdebug("xeno:component:setting:checkbox");

export default class Checkbox extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    checked: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
  };

  checked = null;

  /**
   * @param {string} setting
   * @param {boolean} toState
   * @param {boolean} preventDefault
   * @param event
   * @returns {function(this:Checkbox)}
   */
  handler(setting, toState, preventDefault = true, event) {
    event.persist();

    /*
     * Otherwise, click/change handler fires but the checkbox UI state doesn't update
     */
    window.setTimeout(() => {
      this.checked = toState;
      debug("Firing click handler for checkbox");
      registry.getHandler(types.settingUpdate, preventDefault)(
        [new Setting(setting, toState)],
        event
      );
    }, 0);

    return false;
  }

  render() {
    const id = this.props.id;
    const htmlId = `setting-${id}`;

    const checked = this.checked === null ? this.props.checked : this.checked;

    const next = !checked;

    return (
      <li className="setting-checkbox">
        <a
          onClick={this.handler.bind(this, this.props.id, next, true)}
          className={checked ? "checked" : "unchecked"}
        >
          {this.props.title}
        </a>
      </li>
    );
  }
}
