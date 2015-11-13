const Joi = require('joi');

export const itemsForChannel = {
  params: {
    channel: Joi.string().required().min(3).max(128),
  },
};
