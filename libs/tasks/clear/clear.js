"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const ClearTask_1 = require("./ClearTask");
const gulp = require("gulp");
const ConfigService_1 = require("../../ConfigService");
let config = ConfigService_1.ConfigService.getInstance().getConfig();
let task = new ClearTask_1.ClearTask(config);
ClearTask_1.ClearTask.registerTasks(gulp, {
    taskClass: ClearTask_1.ClearTask,
    taskInstance: task
});
//# sourceMappingURL=clear.js.map