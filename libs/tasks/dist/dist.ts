/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {DistTask} from "./DistTask";
import * as gulp from "gulp";
import {ConfigService} from "../../ConfigService";
import {BaseTask} from "@sokka/gulp-build-tasks/libs/tasks/BaseTask";
let config = ConfigService.getInstance().getConfig();
let task = new DistTask(config);
DistTask.registerTasks(gulp,<BaseTask>task);