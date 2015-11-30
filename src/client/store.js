import dispatcher from './dispatcher';
import ItemStore from './store/ItemStore';
import ChannelStore from './store/ChannelStore';
import SettingStore from './store/SettingStore';
import CurrentChannelStore from './store/CurrentChannelStore';
import CurrentItemStore from './store/CurrentItemStore';
import ViewedItemStore from './store/ViewedItemStore';
import SocketStore from './store/SocketStore';
import ItemByChannelStore from './store/ItemByChannelStore';
import FavouriteChannelStore from './store/FavouriteChannelStore';

export const itemStore = new ItemStore(dispatcher);
export const itemByChannelStore = new ItemByChannelStore(dispatcher);
export const channelStore = new ChannelStore(dispatcher);
export const settingStore = new SettingStore(dispatcher);
export const currentItemStore = new CurrentItemStore(dispatcher);
export const currentChannelStore = new CurrentChannelStore(dispatcher);
export const viewedItemStore = new ViewedItemStore(dispatcher);
export const socketStore = new SocketStore(dispatcher);
export const favouriteChannelStore = new FavouriteChannelStore(dispatcher);

export default {
  item: itemStore,
  itemByChannel: itemByChannelStore,
  channel: channelStore,
  favouriteChannel: favouriteChannelStore,
  setting: settingStore,
  currentItem: currentItemStore,
  currentChannel: currentChannelStore,
  viewedItem: viewedItemStore,
  socket: socketStore,
};
