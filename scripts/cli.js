import * as cheerio from 'cheerio';
import { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';

const INDEX_FILE = 'index.html';
const DIST_FOLDER = './dist';

const program = new Command();

program.version('1.0.0');
program.option(
  '--base-href <type>',
  'Base url for the application being built.',
  '/'
);
program.parse(process.argv);

if (program.baseHref && existsSync(INDEX_FILE)) {
  const $ = cheerio.load(readFileSync(INDEX_FILE).toString());
  if ($('head > meta').length > 0) {
    if ($('head > base').length === 0) {
      $('head > meta').last().after(`\n<base href="${program.baseHref}">`);
    } else {
      $(`base`).attr('href', program.baseHref);
    }
  }
  if (!existsSync(DIST_FOLDER)) {
    mkdirSync(DIST_FOLDER);
  }
  writeFileSync(`${DIST_FOLDER}/${INDEX_FILE}`, $.html());
}
