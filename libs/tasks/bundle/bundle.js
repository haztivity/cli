"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const BundleTask_1 = require("./BundleTask");
const gulp = require("gulp");
const ConfigService_1 = require("../../ConfigService");
let config = ConfigService_1.ConfigService.getInstance().getConfig();
let task = new BundleTask_1.BundleTask(config);
BundleTask_1.BundleTask.registerTasks(gulp, {
    taskClass: BundleTask_1.BundleTask,
    taskInstance: task
});
//# sourceMappingURL=bundle.js.map