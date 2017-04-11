"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
var path = require("path");
var ConfigService = (function () {
    function ConfigService() {
        this._path = path;
        this.loadConfig();
    }
    ConfigService.prototype._readConfigFile = function () {
        return require(this._path.join(process.cwd(), "haztivitycli.config.js"));
    };
    ConfigService.prototype.loadConfig = function () {
        var config = this._readConfigFile();
        if (config) {
            this._config = config.config;
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
