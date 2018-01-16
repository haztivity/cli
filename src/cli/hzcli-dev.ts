#!/usr/bin/env node

import {HzCli} from "../core";

let program = require('..');

program
    .option('-p, --port', 'Port to use for the server')
    .parse(process.argv);
//load hzcli if exists
//create context
//register bundlers
const context = HzCli.getInstance().createContext();