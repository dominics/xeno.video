import Joi from 'joi';
import _ from 'lodash';

const WRITABLE_SETTINGS = ['nsfw', 'autoplay'];

export const itemsForChannel = {
  params: {
    channel: Joi.string().required().min(3).max(128),
  },
};

export const settingUpdate = {
  body: {
    type: Joi.string().required().valid('setting'),
    data: Joi.array().required().items(Joi.object().keys({
      id: Joi.string().required().valid(WRITABLE_SETTINGS),
      value: Joi.boolean().required(),
    })),
  },
};

