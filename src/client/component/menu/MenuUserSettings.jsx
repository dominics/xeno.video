import { default as React, Component } from 'react';
import libdebug from 'debug';
import Checkbox from './Checkbox';
import {List} from 'immutable';
import FavouriteChannelStore from './../../store/FavouriteChannelStore';
import registry from './../../action';
import types from './../../action/types';

const debug = libdebug('xeno:component:menu:user-settings');

export default class MenuUserSettings extends Component {
  static propTypes = {
    setting: React.PropTypes.object.isRequired,
    favouriteChannel: React.PropTypes.instanceOf(List).isRequired,
  };

  render() {
    const options = [];

    if (!this.props.setting.authenticated) {
      options.push(<li key="login"><a href="/login">Login with Reddit</a></li>);
      options.push(<li key="login-separator" role="separator" className="divider" />);
    }

    options.push(<Checkbox key="autoplay" id="autoplay" checked={this.props.setting.autoplay} title="Autoplay" />);
    options.push(<Checkbox key="nsfw" id="nsfw" checked={this.props.setting.nsfw} title="Show NSFW" />);

    if (!FavouriteChannelStore.isDefault(this.props.favouriteChannel)) {
      options.push(<li key="reset-separator" role="separator" className="divider" />);
      options.push(<li className="reset-button">
        <a onClick={registry.getHandler(types.channelReset, true).bind(undefined, null)}>
          Reset Channels
        </a>
      </li>);
    }

    if (this.props.setting.authenticated) {
      options.push(<li key="logout-separator" role="separator" className="divider" />);
      options.push(<li key="logout"><a href="/logout">Logout</a></li>);
    }

    return (
      <ul className="dropdown-menu dropdown-menu-right">
        {options}
      </ul>
    );
  }
}
