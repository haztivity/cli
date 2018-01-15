/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {ICommandArgument, BaseCommand, ICommandOption} from "../BaseCommand";
import {DistTask,IDistTaskOptions} from "../../tasks/dist/DistTask";
import {IFuseBoxServerOptions} from "../../tasks/FuseboxTask";
import {ConfigService,IHaztivityCliConfig} from "../../ConfigService";
import * as path from "path";
import * as fs from "fs";
export class DistCommand extends BaseCommand{

    protected _command: string ="dist";
    protected _description: string="Procesa y crea un paquete para su distribución";
    protected _DistTask = DistTask;
    protected _path = path;
    protected _fs = fs;
    protected _ConfigService = ConfigService;
    protected _arguments(): ICommandArgument[] {
        return [{
            name:"sco"
        }];
    }
    protected _options(): ICommandOption[] {
        return [];
    }
    protected _getDirs(src,regex){
        //todo handle exception
        return this._fs.readdirSync(src)
            .filter(file => this._fs.statSync(this._path.join(src, file)).isDirectory() && regex.test(file));
    }
    protected _validate(args: any): boolean {
        return true;
    }

    protected _autocomplete(): string[] {
        return [];
    }
    protected _execute(sco,options){
        sco = sco.toString();
        let server:IFuseBoxServerOptions = {};
        for(let option in options){
            server[option] = options[option];
        }
        return new this._DistTask({
            scos:[sco]
        }).run();
    }
    protected _action(args,cb,command){
        let options = args.options||{};
        let sco;
        //if sco is provided as option
        if(args.sco){
            sco = args.sco;
            this._execute(sco,options).then(()=>{cb()});
        }else{//otherwise, try to scan the sco folder
            let config = this._ConfigService.getInstance().getConfig();
            //get dirs in sco folder
            let dirs = this._getDirs(this._path.join(config.homeDir,config.scoDir),config.scoTest);
            //if there is more than 1 sco folder, prompt to user
            if(dirs.length > 1) {
                command.prompt({
                    type: "checkbox",
                    name: "sco",
                    message: "Which sco would you like to dist?",
                    choices:dirs.unshift("All"),
                    validate:function(){
                        debugger;
                    }
                },(result)=>{
                    this._execute(result.sco,options).then(()=>{cb()});;
                });
            }else if(dirs.length == 1){//if only one folder is found, use it
                sco = dirs[0];
                this._execute(sco,options).then(()=>{cb()});;
            }else{
                //todo error no sco found
            }
        }

    }
}