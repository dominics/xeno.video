import { default as React, Component } from 'react';
import registry from '../../action';
import types from '../../action/types';
import libdebug from 'debug';

const debug = libdebug('xeno:component:channel:search');

/**
 * Channel search widget on the navbar
 */
export default class Search extends Component {
  searchInput = null;

  setSearchInput(ref) {
    debug('Received search input', ref);
    this.searchInput = ref;
  }

  onAdd(event) {
    if (!this.searchInput) {
      debug('Add button clicked, no search input found');
      return;
    }

    const channel = $(this.searchInput).val();

    if (!channel) {
      debug('Add button clicked, no channel value');
      return;
    }

    debug('Add button clicked, dispatching add');
    return registry.getHandler(types.channelAdd, true)(channel, event);
  }

  render() {
    debug('Rendering channel search'); //

    return (
      <form className="navbar-form navbar-left search" role="search" key="search-form">
        <div className="form-group">
          <div className="input-group">
            <div className="input-group-addon"><span className="fa fa-search" /></div>
            <input type="text" className="form-control" placeholder="subreddit" ref={this.setSearchInput.bind(this)} />
          </div>
          &nbsp;
          <button className="btn btn-default btn-sm" onClick={this.onAdd.bind(this)}>
            <span className="fa fa-plus" />
            <span> &nbsp; Add </span>
          </button>
        </div>
      </form>
    );
  }
}
