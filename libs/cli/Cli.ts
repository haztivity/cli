/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {Logger} from "@sokka/gulp-build-tasks";
import * as program from "commander";
import {BundleCommand} from "./gulpCommands/BundleCommand";
import {DistCommand} from "./gulpCommands/DistCommand";
import * as path from "path";
//Common loger
Logger.getInstance().setTitle("Haztivity");
//haztivity-cli meta data
const pkjson = require(path.join(__dirname,"../../","package.json"));
program.version(pkjson.version);
//Register commands
new BundleCommand(program).register();
new DistCommand(program).register();
//End register commands
program.parse(process.argv);