/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {GBTApi} from "@sokka/gulp-build-tasks";
import * as path from "path";
const api = GBTApi.getInstance();
api.loadTasks().loadTasks(path.join(__dirname,"tasks"));