import GeneralStrategy from './GeneralStrategy.jsx';

export default class YoutubeStrategy extends GeneralStrategy {
  render(viewer, url) {
    // @todo support #t fragments
    return super.render(viewer, url);
  }
}
