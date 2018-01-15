/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
export interface ICommandArgument{
    name:string;
    required?:boolean;
}
export interface ICommandOption{
    name?:string;
    longName?:string;
    arguments?:ICommandArgument[];
    description:string;
    autocomplete?:string[];
    type?:string;
}
export abstract class BaseCommand{
    protected _program;
    protected abstract _command:string;
    protected abstract _description:string;
    constructor(program){
        this._program = program;
    }
    protected _createCommand(){
        return `${this._command} ${this._stringifyArguments(this._arguments())}`;
    }
    protected _parseOptions():any[]{
        let result:any = [];
        let options = this._options();
        for(let option of options){
            let args = this._stringifyArguments(option.arguments);
            let parsed:any = [
                (!!option.name ? "-"+option.name : "")+
                (!!option.name && !!option.longName ? ", ":"")+
                (!!option.longName ? "--"+option.longName :"")+
                (args ? " "+args:""),
                option.description
            ];
            if(option.autocomplete){
                parsed.push(option.autocomplete);
            }
            result.push(parsed);
        }
        return result;
    }
    protected _stringifyArguments(args:ICommandArgument[]=[]):String{
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
    protected abstract _options():ICommandOption[]
    protected abstract _arguments():ICommandArgument[];
    protected abstract _action(args,cb,command);
    protected abstract _validate(args):boolean;
    protected abstract _autocomplete():string[];
    protected _cancel(){

    }
    register(){
        let that = this;
        let command = this._program.command(this._createCommand())
            .description(this._description)
            .validate(this._validate.bind(this));
        let autocomplete = this._autocomplete();
        if(autocomplete != null && autocomplete.length > 0){
            command.autocomplete(autocomplete);
        }
        let options = this._parseOptions();
        for(let option of options){
            command.option(...option);
        }
        command.action(function(...args){
            args.push(this);
            that._action.apply(that,args);
        });
        command.cancel(function(){
            that._cancel();
        })
    }
}