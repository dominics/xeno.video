import dispatcher from './dispatcher';
import { Map } from 'immutable';
import ItemStore from './store/ItemStore';
import ChannelStore from './store/ChannelStore';
import SettingStore from './store/SettingStore';
import CurrentChannelStore from './store/SettingStore';
import CurrentItemStore from './store/SettingStore';
import ViewedItemStore from './store/ViewedItemStore';
import SocketStore from './store/SocketStore';

const itemStore = new ItemStore(dispatcher);
const channelStore = new ChannelStore(dispatcher);
const settingStore = new SettingStore(dispatcher);
const currentItemStore = new CurrentItemStore(dispatcher);
const currentChannelStore = new CurrentChannelStore(dispatcher);
const viewedItemStore = new ViewedItemStore(dispatcher);
const socketStore = new SocketStore(dispatcher);

export default Map({
  item: itemStore,
  channel: channelStore,
  setting: settingStore,
  currentItem: currentItemStore,
  currentChannel: currentChannelStore,
  viewedItem: viewedItemStore,
  socket: socketStore,
});
