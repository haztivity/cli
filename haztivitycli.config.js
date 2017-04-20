"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    homeDir: "./test/course",
    scoTest: /sco*/,
    dev: {
        server: {
            root: ".",
            port: 4444,
            hmr: true
        },
        fusebox: {
            cache: true,
            log: true,
            debug: true
        }
    }
};
