"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const path = require("path");
const extend = require("extend");
const Logger_1 = require("./logger/Logger");
class ConfigService {
    constructor() {
        this._logger = Logger_1.Logger.getInstance();
        this._path = path;
        //protected _logger = Logger.getInstance();
        this._extend = extend;
        this.loadConfig();
    }
    _readConfigFile() {
        let result = null;
        try {
            result = require(this._path.join(process.cwd(), "haztivitycli.config.js"));
            if (result.config) {
                result = result.config;
            }
        }
        catch (e) {
            //todo throw error
            this._logger.error("Fail to read haztivitycli.config.js. Maybe it's malformed?", `Detail:${e.message}`);
        }
        return result;
    }
    _processConfig(config) {
        if (config.dist && config.dist.copy) {
            let copy = config.dist.copy;
            let homeDir = config.homeDir.replace(/^(\.\\|\.\/)/g, ""); //replace .\ or ./ starts
            for (let copyPath = 0, copyLength = copy.length; copyPath < copyLength; copyPath++) {
                let current = copy[copyPath];
                copy[copyPath] = current.replace("{{homeDir}}", homeDir);
            }
        }
        return config;
    }
    loadConfig() {
        let config = this._readConfigFile();
        if (config) {
            let distCopy = config && config.dist && config.dist.copy ? config.dist.copy : [];
            config = this._extend(true, {}, ConfigService.DEFAULTS, config);
            if (distCopy.length > 0) {
                config.dist.copy = distCopy;
            }
            this._config = this._processConfig(config);
            if (this._config.logLevel != undefined) {
                this._logger.setLevel(this._config.logLevel);
            }
        }
        else {
            //todo throw error
            this._logger.error("haztivitycli.config.js not found. Please init use 'hzcli' and 'init'");
        }
        return this;
    }
    getConfig() {
        this.loadConfig();
        return this._config;
    }
    static getInstance() {
        if (!ConfigService._instance) {
            ConfigService._instance = new ConfigService();
        }
        return ConfigService._instance;
    }
}
ConfigService.DEFAULTS = {
    homeDir: "course",
    scoTest: /sco*/i,
    scoDir: ".",
    dev: {
        bundleExpression: ">{{sco}}/index.ts",
        outputDir: "bundles",
        server: {
            port: 8080
        },
        fusebox: {
            outFile: "bundle.js",
            sourceMaps: true
        }
    },
    dist: {
        bundleExpression: ">{{sco}}/index.ts",
        outputDir: "dist",
        copy: [
            "**/*.(ttf|otf|woff|wof2|eot)",
            "{{homeDir}}/**/*.(jpg|png|jpeg|gif)",
            "{{homeDir}}/**/index.html"
        ],
        fusebox: {
            outFile: "bundle.js"
        }
    },
    logLevel: 2 /* INFO */
};
exports.ConfigService = ConfigService;
//# sourceMappingURL=ConfigService.js.map