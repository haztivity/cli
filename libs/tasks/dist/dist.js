"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const gulp = require("gulp");
const ClearTask_1 = require("../clear/ClearTask");
const BundleTask_1 = require("../bundle/BundleTask");
const gulp_build_tasks_1 = require("@sokka/gulp-build-tasks");
const gulpSync = require("gulp-sync")(gulp);
gulp.task("dist", gulpSync.sync([
    ClearTask_1.ClearTask.NAME,
    [gulp_build_tasks_1.SassTask.NAME + ":build", gulp_build_tasks_1.PugTask.NAME + ":build"],
    BundleTask_1.BundleTask.NAME
]));
//# sourceMappingURL=dist.js.map