"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const path = require("path");
const Logger_1 = require("@sokka/gulp-build-tasks/libs/Logger");
const extend = require("extend");
class ConfigService {
    constructor() {
        this._path = path;
        this._logger = Logger_1.Logger.getInstance();
        this._extend = extend;
        this.loadConfig();
    }
    _readConfigFile() {
        let result = null;
        try {
            result = require(this._path.join(process.cwd(), "haztivitycli.config.js"));
            if (result.config) {
                result = result.config;
                if (!result.src || !result.src.path || !result.dest || !result.dest.path) {
                    result = null;
                }
            }
        }
        catch (e) {
        }
        return result;
    }
    loadConfig() {
        let config = this._readConfigFile();
        if (config) {
            this._config = config;
        }
        else {
            this._logger.error("Haztivity", "haztivitycli.config.js not found. Please init haztivity");
        }
    }
    getConfig() {
        return this._config;
    }
    static getInstance() {
        if (!ConfigService._instance) {
            ConfigService._instance = new ConfigService();
        }
        return ConfigService._instance;
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=ConfigService.js.map