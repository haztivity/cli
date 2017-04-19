"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const path = require("path");
const extend = require("extend");
class ConfigService {
    constructor() {
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
        }
        return result;
    }
    loadConfig() {
        let config = this._readConfigFile();
        if (config) {
            this._config = this._extend(true, {}, ConfigService.DEFAULTS, config);
        }
        else {
            //todo throw error
            //this._logger.error("Haztivity","haztivitycli.config.js not found. Please init haztivity");
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
    bundlesDir: "../bundles",
    dev: {
        server: {
            port: 8080
        }
    }
};
exports.ConfigService = ConfigService;
//# sourceMappingURL=ConfigService.js.map