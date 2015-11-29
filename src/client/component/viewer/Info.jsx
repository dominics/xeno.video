import { default as React } from 'react';
import moment from 'moment';

/**
 * @returns {XML}
 */
export default ({url, commentsUrl, createdUtc, numComments}) => {
  const relativeDate = moment(createdUtc * 1000).fromNow();

  return (
    <section className="info">
      <ul>
        <li>
          <a href={url}>
            <span className="fa fa-external-link"></span>
            {url}
          </a>
        </li>
        <li>
          <span className="fa fa-clock-o"></span>
          {relativeDate}
        </li>
        <li>
          <a href={commentsUrl}>
            <span className="fa fa-reddit"></span>
            {numComments} comments
          </a>
        </li>
      </ul>
    </section>
  );
};
