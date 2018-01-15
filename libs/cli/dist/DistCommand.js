"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const BaseCommand_1 = require("../BaseCommand");
const DistTask_1 = require("../../tasks/dist/DistTask");
const ConfigService_1 = require("../../ConfigService");
const path = require("path");
const fs = require("fs");
class DistCommand extends BaseCommand_1.BaseCommand {
    constructor() {
        super(...arguments);
        this._command = "dist";
        this._description = "Procesa y crea un paquete para su distribución";
        this._DistTask = DistTask_1.DistTask;
        this._path = path;
        this._fs = fs;
        this._ConfigService = ConfigService_1.ConfigService;
    }
    _arguments() {
        return [{
                name: "sco"
            }];
    }
    _options() {
        return [];
    }
    _getDirs(src, regex) {
        //todo handle exception
        return this._fs.readdirSync(src)
            .filter(file => this._fs.statSync(this._path.join(src, file)).isDirectory() && regex.test(file));
    }
    _validate(args) {
        return true;
    }
    _autocomplete() {
        return [];
    }
    _execute(sco, options) {
        sco = sco.toString();
        let server = {};
        for (let option in options) {
            server[option] = options[option];
        }
        return new this._DistTask({
            scos: [sco]
        }).run();
    }
    _action(args, cb, command) {
        let options = args.options || {};
        let sco;
        //if sco is provided as option
        if (args.sco) {
            sco = args.sco;
            this._execute(sco, options).then(() => { cb(); });
        }
        else {
            let config = this._ConfigService.getInstance().getConfig();
            //get dirs in sco folder
            let dirs = this._getDirs(this._path.join(config.homeDir, config.scoDir), config.scoTest);
            //if there is more than 1 sco folder, prompt to user
            if (dirs.length > 1) {
                command.prompt({
                    type: "checkbox",
                    name: "sco",
                    message: "Which sco would you like to dist?",
                    choices: dirs.unshift("All"),
                    validate: function () {
                        debugger;
                    }
                }, (result) => {
                    this._execute(result.sco, options).then(() => { cb(); });
                    ;
                });
            }
            else if (dirs.length == 1) {
                sco = dirs[0];
                this._execute(sco, options).then(() => { cb(); });
                ;
            }
            else {
                //todo error no sco found
            }
        }
    }
}
exports.DistCommand = DistCommand;
//# sourceMappingURL=DistCommand.js.map