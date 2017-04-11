/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {BundleTask} from "./BundleTask";
import * as gulp from "gulp";
import {ConfigService} from "../../ConfigService";
let config = ConfigService.getInstance().getConfig();
let task = new BundleTask(config);
BundleTask.registerTasks(gulp,{
    taskClass:BundleTask,
    taskInstance:task
});