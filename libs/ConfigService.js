"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
var path = require("path");
var extend = require("extend");
var Logger_1 = require("./logger/Logger");
var ConfigService = (function () {
    function ConfigService() {
        this._logger = Logger_1.Logger.getInstance();
        this._path = path;
        //protected _logger = Logger.getInstance();
        this._extend = extend;
        this.loadConfig();
    }
    ConfigService.prototype._readConfigFile = function () {
        var result = null;
        try {
            result = require(this._path.join(process.cwd(), "haztivitycli.config.js"));
            if (result.config) {
                result = result.config;
            }
        }
        catch (e) {
            //todo throw error
            this._logger.error("Fail to read haztivitycli.config.js. Maybe it's malformed?");
        }
        return result;
    };
    ConfigService.prototype._processConfig = function (config) {
        if (config.dist && config.dist.copy) {
            var copy = config.dist.copy;
            var homeDir = config.homeDir.replace(/^(\.\\|\.\/)/g, ""); //replace .\ or ./ starts
            for (var copyPath = 0, copyLength = copy.length; copyPath < copyLength; copyPath++) {
                var current = copy[copyPath];
                copy[copyPath] = current.replace("{{homeDir}}", homeDir);
            }
        }
        return config;
    };
    ConfigService.prototype.loadConfig = function () {
        var config = this._readConfigFile();
        if (config) {
            var distCopy = config && config.dist && config.dist.copy ? config.dist.copy : [];
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
    };
    ConfigService.prototype.getConfig = function () {
        this.loadConfig();
        return this._config;
    };
    ConfigService.getInstance = function () {
        if (!ConfigService._instance) {
            ConfigService._instance = new ConfigService();
        }
        return ConfigService._instance;
    };
    return ConfigService;
}());
ConfigService.DEFAULTS = {
    homeDir: "course",
    scoTest: /sco*/i,
    scoDir: ".",
    dev: {
        outputDir: "bundles",
        server: {
            port: 8080
        }
    },
    dist: {
        outputDir: "dist",
        copy: [
            "**/*.(ttf|otf|woff|wof2|eot)",
            "{{homeDir}}/**/*.(jpg|png|jpeg|gif)",
            "{{homeDir}}/**/index.html"
        ]
    },
    logLevel: 2 /* INFO */
};
exports.ConfigService = ConfigService;
