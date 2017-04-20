"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
var path = require("path");
var extend = require("extend");
var ConfigService = (function () {
    function ConfigService() {
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
        }
        return result;
    };
    ConfigService.prototype.loadConfig = function () {
        var config = this._readConfigFile();
        if (config) {
            this._config = this._extend(true, {}, ConfigService.DEFAULTS, config);
        }
        else {
            //todo throw error
            //this._logger.error("Haztivity","haztivitycli.config.js not found. Please init haztivity");
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
    bundlesDir: "../bundles",
    dev: {
        server: {
            port: 8080
        }
    }
};
exports.ConfigService = ConfigService;
