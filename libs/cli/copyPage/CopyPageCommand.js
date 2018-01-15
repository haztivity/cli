"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const BaseCommand_1 = require("../BaseCommand");
const ConfigService_1 = require("../../ConfigService");
const path = require("path");
const fs = require("fs");
const CopyPageTask_1 = require("../../tasks/copyPage/CopyPageTask");
const Logger_1 = require("../../logger/Logger");
class CopyPageCommand extends BaseCommand_1.BaseCommand {
    constructor() {
        super(...arguments);
        this._command = "copyPage";
        this._description = "Copia una página";
        this._CopyPageTask = CopyPageTask_1.CopyPageTask;
        this._path = path;
        this._fs = fs;
        this._ConfigService = ConfigService_1.ConfigService;
        this._logger = Logger_1.Logger.getInstance();
    }
    _arguments() {
        return [
            {
                name: "copy"
            },
            {
                name: "to"
            }
        ];
    }
    _options() {
        return [
            {
                name: "f",
                longName: "force",
                description: "Fuerza la copia. Si existen ficheros los sobre escribe"
            }
        ];
    }
    _validate(args) {
        return true;
    }
    _autocomplete() {
        return [];
    }
    _execute(copy, to, options) {
        copy = copy.toString();
        to = to.toString();
        try {
            new this._CopyPageTask({
                copy: copy,
                to: to,
                force: options.force
            }).run();
        }
        catch (e) {
            this._logger.error(e);
        }
    }
    _action(args, cb, command) {
        let options = args.options || {};
        let sco;
        let prompts = [];
        //if copy is not provided
        if (!args.copy) {
            prompts.push({
                name: "copy",
                message: "Ruta del directorio con la página a copiar: "
            });
        }
        //prompt
        //if to is not provided
        if (!args.to) {
            prompts.push({
                name: "to",
                message: "Directorio de destino: "
            });
        }
        //promt
        //otherwise
        if (args.copy && args.to) {
            this._execute(args.copy, args.to, options);
            cb();
        }
        else {
            command.prompt(prompts, (result) => {
                this._execute(result.copy, result.to, options);
                cb();
            });
        }
    }
}
exports.CopyPageCommand = CopyPageCommand;
//# sourceMappingURL=CopyPageCommand.js.map