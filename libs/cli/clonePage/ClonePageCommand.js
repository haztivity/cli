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
const ClonePageTask_1 = require("../../tasks/clonePage/ClonePageTask");
const Logger_1 = require("../../logger/Logger");
class ClonePageCommand extends BaseCommand_1.BaseCommand {
    constructor() {
        super(...arguments);
        this._command = "clonePage";
        this._description = "Copia una o varias páginas";
        this._path = path;
        this._fs = fs;
        this._ConfigService = ConfigService_1.ConfigService;
        this._logger = Logger_1.Logger.getInstance();
    }
    _arguments() {
        return [
            {
                name: "clone"
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
    _execute(clone, to, options) {
        let toList = [], cloneList = [];
        if (clone.search(/(,|;)/) != -1) {
            let cloneItems = clone.split(";");
            for (let cloneItemString of cloneItems) {
                let items = cloneItemString.split(","), base = items.shift();
                for (let item of items) {
                    cloneList.push(path.resolve(base, item));
                }
            }
            let toItems = to.split(";");
            for (let toItemString of toItems) {
                let items = toItemString.split(","), base = items.shift();
                for (let item of items) {
                    toList.push(path.resolve(base, item));
                }
            }
            if (cloneList.length != toList.length) {
                this._logger.error(`The clone and to params should have the same items when multiple pages are provided. clone items: ${cloneList.length}, to items:${toList.length}`);
                cloneList = [];
                toList = [];
            }
        }
        else {
            cloneList.push(clone);
            toList.push(to);
        }
        for (let index = 0, cloneListLength = cloneList.length; index < cloneListLength; index++) {
            try {
                new ClonePageTask_1.ClonePageTask({
                    clone: cloneList[index],
                    to: toList[index],
                    force: options.force
                }).run();
            }
            catch (e) {
                this._logger.error(e);
            }
        }
    }
    _action(args, cb, command) {
        let options = args.options || {};
        let sco;
        let prompts = [];
        if (!args.to) {
            prompts.push({
                name: "to",
                message: "Directorio de destino: "
            });
        }
        //if clone is not provided
        if (!args.clone) {
            prompts.push({
                name: "clone",
                message: "Ruta del directorio con la página a clone: "
            });
        }
        if (args.clone && args.to) {
            this._execute(args.clone, args.to, options);
            cb();
        }
        else {
            command.prompt(prompts, (result) => {
                this._execute(result.clone, result.to, options);
                cb();
            });
        }
    }
}
exports.ClonePageCommand = ClonePageCommand;
//# sourceMappingURL=ClonePageCommand.js.map