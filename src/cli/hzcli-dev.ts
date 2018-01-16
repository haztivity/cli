#!/usr/bin/env node

import {
    HzBundler,
    HzCli
} from "../core";

let program = require('..');

program
    .option('-p, --port', 'Port to use for the server')
    .parse(process.argv);
//load hzcli if exists
//create context
//register bundles
const bundler:HzBundler = hzCli.initBundler();
bundler.bundle("sco1111");
bundler.run();