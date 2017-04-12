import {IExportedCommand} from "commander";
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
export interface ICommandArgument{
    name:string;
    required?:boolean;
}
export abstract class BaseCommand{
    protected _commander;
    protected abstract _command:string;
    protected abstract _description:string;
    constructor(commander:IExportedCommand){
        this._commander = commander;
    }
    protected _createCommand(){
        return `${this._command} ${this._stringifyArguments(this._arguments())}`;
    }
    protected _stringifyArguments(args:ICommandArgument[]):String{
        let result = [];
        for(let arg of args){
            if(arg.required == true){
                result.push(`<${arg.name}>`);
            }else{
                result.push(`[${arg.name}]`);
            }
        }
        return result.join(" ");
    }
    protected abstract _arguments():ICommandArgument[];
    protected abstract _action();
    register(){
        this._commander.command(this._createCommand())
            .description(this._description)
            .action(this._action.bind(this));
    }
}