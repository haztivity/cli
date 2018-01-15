"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const BaseCommand_1 = require("../BaseCommand");
const DevTask_1 = require("../../tasks/dev/DevTask");
const ConfigService_1 = require("../../ConfigService");
const path = require("path");
const fs = require("fs");
class DevCommand extends BaseCommand_1.BaseCommand {
    constructor() {
        super(...arguments);
        this._command = "dev";
        this._description = "Ejecuta los procesos para desarrollar";
        this._DevTask = DevTask_1.DevTask;
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
        return [
            {
                longName: "no-hmr",
                description: "Deshabilita el modo hot module reload (hmr) de fusebox"
            },
            {
                name: "p",
                longName: "port",
                arguments: [
                    {
                        name: "port",
                        required: true
                    }
                ],
                description: "Indica el puerto a utilizar por dev server"
            },
            {
                name: "r",
                longName: "root",
                arguments: [
                    {
                        name: "path",
                        required: true
                    }
                ],
                description: "Indica la ruta a utilizar como root por dev server"
            }
        ];
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
        this._task = new this._DevTask({
            sco: sco,
            server: server
        });
        return this._task.run();
    }
    _cancel() {
        if (this._task) {
            this._task.cancel();
        }
    }
    _action(args, cb, command) {
        let options = args.options || {};
        let sco;
        //if sco is provided as option
        if (args.sco) {
            sco = args.sco;
            this._execute(sco, options);
        }
        else {
            let config = this._ConfigService.getInstance().getConfig();
            //get dirs in sco folder
            let dirs = this._getDirs(this._path.join(config.homeDir, config.scoDir), config.scoTest);
            //if there is more than 1 sco folder, prompt to user
            if (dirs.length > 1) {
                command.prompt({
                    type: "list",
                    name: "sco",
                    message: "In which sco would you like to develop?",
                    choices: dirs
                }, (result) => {
                    this._execute(result.sco, options);
                });
            }
            else if (dirs.length == 1) {
                sco = dirs[0];
                this._execute(sco, options);
            }
            else {
                //todo error no sco found
            }
        }
    }
}
exports.DevCommand = DevCommand;
//# sourceMappingURL=DevCommand.js.map