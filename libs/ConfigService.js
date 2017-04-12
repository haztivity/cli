"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
var path = require("path");
var Logger_1 = require("@sokka/gulp-build-tasks/libs/Logger");
var extend = require("extend");
var ConfigService = (function () {
    function ConfigService() {
        this._path = path;
        this._logger = Logger_1.Logger.getInstance();
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
        }
        return result;
    };
    ConfigService.prototype.loadConfig = function () {
        var config = this._readConfigFile();
        if (config) {
            this._config = config;
        }
        else {
            this._logger.error("Haztivity", "haztivitycli.config.js not found. Please init haztivity");
        }
    };
    ConfigService.prototype.getConfig = function () {
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
exports.ConfigService = ConfigService;
