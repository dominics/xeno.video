import refresh from 'passport-oauth2-refresh';
import libdebug from 'debug';

const debug = libdebug('xeno:session:refresh');

export default (strategy) => {
  refresh.use(strategy);
  return refresh;
};
