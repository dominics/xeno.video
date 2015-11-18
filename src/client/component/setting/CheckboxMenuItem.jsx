import { default as React, Component } from 'react';
import types from './../../action/types';
import registry from './../../action';
import libdebug from 'debug';

const debug = libdebug('xeno:component:setting:checkbox');

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
    (registry.getHandler(types.settingUpdate, preventDefault))({ id: setting, checked: toState }, event);
  }

  render() {
    const id = this.props.id;
    const htmlId = `setting-${id}`;

    const checked = this.checked === null
      ? this.props.checked
      : this.checked;

    const next = !checked;

    return (
      <li className="setting-checkbox">
        <a onClick={this.handler.bind(this, this.props.id, next, true)}>
          <div className="checkbox">
            <input type="checkbox" id={htmlId} defaultChecked={checked} onChange={this.handler.bind(this, id, next, false)} />

            <label htmlFor={htmlId} onClick={this.handler.bind(this, id, next, true)}>
              {this.props.title}
            </label>
          </div>
        </a>
      </li>
    );
  }
}
