/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {ConfigService,IHaztivityCliConfig} from "./libs/ConfigService";
export const config:IHaztivityCliConfig = {
    src:{
        path:"./src"
    },
    dest:{
        path:"./test/dist"
    },
    verbose:true,
    bundle: {
        src: "index.js",
        dest: "index.js",
        copy: [
            "./test/src/**/*.txt",
            "./test/src/index.html",
            "./test/**/font-awesome*/fonts/**/*",
            "./test/**/font-awesome*/css/**/*"
        ]
    }
};