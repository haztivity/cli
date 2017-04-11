/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {ClearTask} from "./ClearTask";
import * as gulp from "gulp";
import {ConfigService} from "../../ConfigService";
import {BaseTask} from "@sokka/gulp-build-tasks/libs/tasks/BaseTask";
let config = ConfigService.getInstance().getConfig();
let task = new ClearTask(config);
ClearTask.registerTasks(gulp,<BaseTask>task);