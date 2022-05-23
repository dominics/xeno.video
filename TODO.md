# TODO

## Refresh

- Replace wercker (with Github Actions?)
- Replace gulp with webpack bundling
- Update all dependencies
  - Replace superagent with fetch or axios
  - Replace browserify, bower with Webpack
  - Remove babel (not needed with TS build to node-compatible ES6+)\
  - Replace karma (with Jest and Cypress?)
  - Replace yargs with oclif
  - Replace 
- Maybe start a simple all-encompassing functional test with Cypress before going further?
- Add Typescript configuration, start to convert our code where easy
- Update React (currently 0.14!)
- Replace container with serverless? or prepare container to run in AWS Lambda etc.?

### Question about strategy

- Transition into SWC and next.js right away, or do a webpack temporary upgrade?
- Against Next right away, it only supports down to React 17, and crashes on lower, because it's
  got deep integration into react-dom etc.
  - And we need to upgrade from 0.14 first, and we don't want to do that with ancient gulp

## Other
### Short term

* Prewarm more than the defaults
* Filter channels with strictly no items
* Score on item list, maybe links too
* Key shortcuts

### Long term

* Watched items
* Channel updates via websocket
* Rand subreddit button
* Selenium testing
