import Yargs from 'yargs';

function commonOptions(yargs) {
  yargs
    .options({
      'verbose': {
        type: 'count',
        alias: 'v',
        describe: 'Output more information (provide multiple times for more noise)',
      },
      'quiet': {
        type: 'count',
        alias: 'q',
        describe: 'Output less information (provide multiple times for less noise)',
      },
    });

  return yargs;
}

export default (config) => {
  let argv = null;

  argv = Yargs
    .strict()
    .usage(`Usage: xeno <subcommand> [options]`)
    .help('help')
    .command('prewarm', 'Prewarm various caches', (yargs) => {
      argv = commonOptions(yargs)
        .usage(`Usage: xeno prewarm [options]`)
        .help('help')
        .argv;
    })
    .argv;

  return argv;
};
