/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {ConfigService,IHaztivityCliConfig} from "./libs/ConfigService";
export const config:IHaztivityCliConfig = {
    base:"test",
    dest:"dist",
    verbose:true,
    bundle: {
        src: "src/index.js",
        dest: "index.js",
        copy: [
            "./src/**/*.txt",
            "./src/index.html",
            "./**/jspm_packages/**/font-awesome*/fonts/**/*",
            "./**/jspm_packages/**/font-awesome*/css/**/*"
        ]
    }
};