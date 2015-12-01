import { default as React, Component } from 'react';

import libdebug from 'debug';

const debug = libdebug('xeno:component:channel:search');

/**
 * Channel search widget on the navbar
 */
export default class Search extends Component {
  render() {
    debug('Rendering channel search'); //

    return (
      <form className="navbar-form navbar-left search" role="search">
        <div className="form-group">
          <div className="input-group">
            <div className="input-group-addon"><span className="fa fa-search" /></div>
            <input type="text" className="form-control" placeholder="subreddit" />
          </div>
          &nbsp;
          <button className="btn btn-default btn-sm">
            <span className="fa fa-plus" />
            <span> &nbsp; Add </span>
          </button>
        </div>
      </form>
    );
  }
}
