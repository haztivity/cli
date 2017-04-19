"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    homeDir: "./test/course",
    scoTest: /sco*/,
    dev: {
        server: {
            root: ".",
            hmr: true
        },
        fusebox: {
            cache: true,
            log: true,
            debug: true
        }
    }
};
