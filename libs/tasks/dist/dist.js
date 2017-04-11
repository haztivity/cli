"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const gulp = require("gulp");
const gulpSync = require("gulp-sync")(gulp);
const ClearTask_1 = require("../clear/ClearTask");
const BundleTask_1 = require("../bundle/BundleTask");
gulp.task("dist", gulpSync.sync([
    ClearTask_1.ClearTask.NAME,
    BundleTask_1.BundleTask.NAME
]));
//# sourceMappingURL=dist.js.map