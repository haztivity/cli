/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as gulp from "gulp";
const gulpSync = require("gulp-sync")(gulp);
import {ClearTask} from "../clear/ClearTask";
import {BundleTask} from "../bundle/BundleTask";
gulp.task("dist",gulpSync.sync([
    ClearTask.NAME,
    BundleTask.NAME
]));