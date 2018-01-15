"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseCommand {
    constructor(program) {
        this._program = program;
    }
    _createCommand() {
        return `${this._command} ${this._stringifyArguments(this._arguments())}`;
    }
    _parseOptions() {
        let result = [];
        let options = this._options();
        for (let option of options) {
            let args = this._stringifyArguments(option.arguments);
            let parsed = [
                (!!option.name ? "-" + option.name : "") +
                    (!!option.name && !!option.longName ? ", " : "") +
                    (!!option.longName ? "--" + option.longName : "") +
                    (args ? " " + args : ""),
                option.description
            ];
            if (option.autocomplete) {
                parsed.push(option.autocomplete);
            }
            result.push(parsed);
        }
        return result;
    }
    _stringifyArguments(args = []) {
        let result = [];
        for (let arg of args) {
            if (arg.required == true) {
                result.push(`<${arg.name}>`);
            }
            else {
                result.push(`[${arg.name}]`);
            }
        }
        return result.join(" ");
    }
    _cancel() {
    }
    register() {
        let that = this;
        let command = this._program.command(this._createCommand())
            .description(this._description)
            .validate(this._validate.bind(this));
        let autocomplete = this._autocomplete();
        if (autocomplete != null && autocomplete.length > 0) {
            command.autocomplete(autocomplete);
        }
        let options = this._parseOptions();
        for (let option of options) {
            command.option(...option);
        }
        command.action(function (...args) {
            args.push(this);
            that._action.apply(that, args);
        });
        command.cancel(function () {
            that._cancel();
        });
    }
}
exports.BaseCommand = BaseCommand;
//# sourceMappingURL=BaseCommand.js.map