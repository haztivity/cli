#!/usr/bin/env node

let program = require('..');
import * as path from "path";
const pckg = require(path.join(process.cwd(),'package.json'));
program
    .version(pckg.version)
    .description('Haztivity cli')
    .command('dev [sco]', 'Launch development for a sco.').alias('d')
    .command('dist [sco...]', 'Launch distribution for a sco or a group of scos.').alias('D')
    .parse(process.argv);