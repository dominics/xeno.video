import Joi from 'joi';

export const itemsForChannel = {
  params: {
    channel: Joi.string().required().min(3).max(128),
  },
};
