/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {ICommandArgument, BaseCommand, ICommandOption} from "../BaseCommand";
import {IFuseBoxServerOptions} from "../../tasks/FuseboxTask";
import {ConfigService,IHaztivityCliConfig} from "../../ConfigService";
import * as path from "path";
import * as fs from "fs";
import {CopyPageTask,CopyPageOptions} from "../../tasks/copyPage/CopyPageTask";
import {Logger} from "../../logger/Logger";
export class CopyPageCommand extends BaseCommand{

    protected _command: string ="copyPage";
    protected _description: string="Copia una página";
    protected _CopyPageTask = CopyPageTask;
    protected _path = path;
    protected _fs = fs;
    protected _ConfigService = ConfigService;
    protected _logger = Logger.getInstance();
    protected _arguments(): ICommandArgument[] {
        return [
            {
                name:"copy"
            },
            {
                name:"to"
            }
        ];
    }
    protected _options(): ICommandOption[] {
        return [
            {
                name:"f",
                longName:"force",
                description:"Fuerza la copia. Si existen ficheros los sobre escribe"
            }
        ];
    }
    protected _validate(args: any): boolean {
        return true;
    }

    protected _autocomplete(): string[] {
        return [];
    }
    protected _execute(copy,to,options){
        copy = copy.toString();
        to = to.toString();
        try {
            new this._CopyPageTask({
                copy: copy,
                to: to,
                force: options.force
            }).run();
        }catch(e){
            this._logger.error(e);
        }
    }
    protected _action(args,cb,command){
        let options = args.options||{};
        let sco;
        let prompts = [];
        //if copy is not provided
        if(!args.copy){
            prompts.push({
                name:"copy",
                message:"Ruta del directorio con la página a copiar: "
            });
        }
            //prompt
        //if to is not provided
        if(!args.to){
            prompts.push({
                name:"to",
                message:"Directorio de destino: "
            });
        }
            //promt
        //otherwise
        if(args.copy && args.to){
            this._execute(args.copy,args.to,options);
            cb();
        }else{
            command.prompt(prompts,(result)=>{
                this._execute(result.copy,result.to,options);
                cb();
            });
        }

    }
}