"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const program = require("vorpal");
const vorpal = program();
const DevCommand_1 = require("./dev/DevCommand");
const DistCommand_1 = require("./dist/DistCommand");
const ClonePageCommand_1 = require("./clonePage/ClonePageCommand");
const path = require("path");
//Common loger
//haztivity-cli meta data
const pkjson = require(path.join(__dirname, "../../", "package.json"));
//Register commands
new DevCommand_1.DevCommand(vorpal).register();
new DistCommand_1.DistCommand(vorpal).register();
new ClonePageCommand_1.ClonePageCommand(vorpal).register();
//End register commands
vorpal.delimiter("haztivity$");
vorpal.show();
//# sourceMappingURL=Cli.js.map