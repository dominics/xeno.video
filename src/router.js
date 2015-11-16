import express from 'express';

export default (config, routes) => {
  const router = express.Router();

  console.log('routes in router', router);

  return router;
};
