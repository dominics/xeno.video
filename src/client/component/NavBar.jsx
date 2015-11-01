import { default as React, Component } from 'react/addons';
import libdebug from 'debug';
import ChannelList from './channel/List';
import ChannelSearch from './channel/Search';
import { Map } from 'immutable';

const debug = libdebug('xeno:component:navBar');

export default class NavBar extends Component {
  static propTypes = {
    setting: React.PropTypes.object.isRequired,
    channel: React.PropTypes.instanceOf(Map).isRequired,
    currentChannel: React.PropTypes.object,
  };

  render() {
    return (
      <nav className="navbar navbar-default">
        <section className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only"></span>
              <span className="fa fa-bars"></span>
            </button>

            <a className="navbar-brand" href="#">
              <span className="icomoon-logo"></span>
              <h1>xeno.video</h1>
            </a>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ChannelList
              channel={this.props.channel}
              currentChannel={this.props.currentChannel} />

            <ChannelSearch />





            <ul className="nav navbar-nav navbar-right">
              <li><a href="#">Link</a></li>
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  <li><a href="#">Action</a></li>
                  <li><a href="#">Another action</a></li>
                  <li><a href="#">Something else here</a></li>
                  <li role="separator" className="divider"></li>
                  <li><a href="#">Separated link</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </section>


      </nav>
    );
  }
}
