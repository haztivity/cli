/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as program from "vorpal";
const vorpal = program();

import {DevCommand} from "./dev/DevCommand";
import * as path from "path";
//Common loger
//haztivity-cli meta data
const pkjson = require(path.join(__dirname,"../../","package.json"));
//Register commands
new DevCommand(vorpal).register();
//End register commands
vorpal.delimiter("haztivity$");
vorpal.show();