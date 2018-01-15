/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {ICommandArgument, BaseCommand, ICommandOption} from "../BaseCommand";
import {IFuseBoxServerOptions} from "../../tasks/FuseboxTask";
import {ConfigService,IHaztivityCliConfig} from "../../ConfigService";
import * as path from "path";
import * as fs from "fs";
import {ClonePageOptions,ClonePageTask} from "../../tasks/clonePage/ClonePageTask";
import {Logger} from "../../logger/Logger";
export class ClonePageCommand extends BaseCommand{

    protected _command: string ="clonePage";
    protected _description: string="Copia una o varias páginas";
    protected _path = path;
    protected _fs = fs;
    protected _ConfigService = ConfigService;
    protected _logger = Logger.getInstance();
    protected _arguments(): ICommandArgument[] {
        return [
            {
                name:"clone"
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
    protected _execute(clone,to,options){
        let toList = [],
            cloneList = [];
        if(clone.search(/(,|;)/) != -1){
            let cloneItems = clone.split(";");
            for(let cloneItemString of cloneItems){
                let items = cloneItemString.split(","),
                    base = items.shift();
                for(let item of items){
                    cloneList.push(path.resolve(base,item));
                }
            }

            let toItems = to.split(";");
            for(let toItemString of toItems){
                let items = toItemString.split(","),
                    base = items.shift();
                for(let item of items){
                    toList.push(path.resolve(base,item));
                }
            }
            if(cloneList.length != toList.length){
                this._logger.error(`The clone and to params should have the same items when multiple pages are provided. clone items: ${cloneList.length}, to items:${toList.length}`);
                cloneList = [];
                toList = [];
            }
        }else{
            cloneList.push(clone);
            toList.push(to);
        }
        for (let index = 0, cloneListLength = cloneList.length; index < cloneListLength; index++) {
            try {
                new ClonePageTask({
                    clone: cloneList[index],
                    to: toList[index],
                    force: options.force
                }).run();
            }catch(e){
                this._logger.error(e);
            }
        }

    }
    protected _action(args,cb,command){
        let options = args.options||{};
        let sco;
        let prompts = [];
        //if clone is not provided
        if(!args.clone){
            prompts.push({
                name:"clone",
                message:"Ruta del directorio con la página a clone: "
            });
        }
        if(!args.to){
            prompts.push({
                name:"to",
                message:"Directorio de destino: "
            });
        }

        if(args.clone && args.to){
            this._execute(args.clone,args.to,options);
            cb();
        }else{
            command.prompt(prompts,(result)=>{
                this._execute(result.clone,result.to,options);
                cb();
            });
        }

    }
}