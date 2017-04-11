"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    src: {
        path: "./src"
    },
    dest: {
        path: "./test/dist"
    },
    verbose: true,
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
