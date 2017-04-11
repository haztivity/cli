"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const DistTask_1 = require("./DistTask");
const gulp = require("gulp");
const ConfigService_1 = require("../../ConfigService");
let config = ConfigService_1.ConfigService.getInstance().getConfig();
let task = new DistTask_1.DistTask(config);
DistTask_1.DistTask.registerTasks(gulp, task);
//# sourceMappingURL=dist.js.map