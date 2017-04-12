"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    base: "test",
    dest: "dist",
    verbose: true,
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
