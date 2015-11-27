import refresh from 'passport-oauth2-refresh';
import libdebug from 'debug';

const debug = libdebug('xeno:session:refresh');

export default (strategy) => {
  refresh.use(strategy);

  /*
   * The passport-reddit strategy says:
   *  Reddit token endpoint expects basic auth header "with the consumer key as the username
   *  and the consumer secret as the password". To comply we are resorting to overriding
   *  node-oauth's implmentation of getOAuthAccessToken().
   *
   * So, when passport-oauth2-refresh creates itself an OAuth2 instance, we have
   * to carry this monkey patching through
   */
  const context = refresh._strategies.reddit.refreshOAuth2;
  context.getOAuthAccessToken = strategy._oauth2.getOAuthAccessToken.bind(context);

  return refresh;
};
