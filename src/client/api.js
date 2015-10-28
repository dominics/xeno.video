import Channel from './api/Channel';
import Item from './api/Item';
import Setting from './api/Setting';

export const channel = new Channel();
export const item = new Item();
export const setting = new Setting();

export default {
  channel: channel,
  item: item,
  setting: setting,
};
