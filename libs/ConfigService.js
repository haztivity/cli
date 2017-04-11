"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const path = require("path");
class ConfigService {
    constructor() {
        this._path = path;
        this.loadConfig();
    }
    _readConfigFile() {
        return require(this._path.join(process.cwd(), "haztivitycli.config.js"));
    }
    loadConfig() {
        let config = this._readConfigFile();
        if (config) {
            this._config = config.config;
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