/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as gulp from "gulp";
import {ClearTask} from "../clear/ClearTask";
import {BundleTask} from "../bundle/BundleTask";
import {SassTask,PugTask} from "@sokka/gulp-build-tasks";
const gulpSync = require("gulp-sync")(gulp);
gulp.task("dist",gulpSync.sync([
    ClearTask.NAME,
    [SassTask.NAME+":build",PugTask.NAME+":build"],
    BundleTask.NAME
]));