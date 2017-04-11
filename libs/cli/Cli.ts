/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const vorpal = require("vorpal")();
import "../loadTasks";
import {BundleCommand} from "./Bundle";
new BundleCommand(vorpal).register();
vorpal
    .delimiter('haztivity$')
    .show();