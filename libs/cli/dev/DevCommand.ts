/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {ICommandArgument, BaseCommand, ICommandOption} from "../BaseCommand";
import {DevTask, IDevTaskOptions} from "../../tasks/dev/DevTask";
import {IFuseBoxServerOptions} from "../../tasks/FuseboxTask";
import {ConfigService,IHaztivityCliConfig} from "../../ConfigService";
import * as path from "path";
import * as fs from "fs";
export class DevCommand extends BaseCommand{

    protected _command: string ="dev";
    protected _description: string="Ejecuta los procesos para desarrollar";
    protected _DevTask = DevTask;
    protected _path = path;
    protected _fs = fs;
    protected _ConfigService = ConfigService;
    protected _arguments(): ICommandArgument[] {
        return [{
            name:"sco"
        }];
    }
    protected _options(): ICommandOption[] {
        return [
            {
                longName:"no-hmr",
                description:"Deshabilita el modo hot module reload (hmr) de fusebox"
            },
            {
                name:"p",
                longName:"port",
                arguments:[
                    {
                        name:"port",
                        required:true
                    }
                ],
                description:"Indica el puerto a utilizar por dev server"
            },
            {
                name:"r",
                longName:"root",
                arguments:[
                    {
                        name: "path",
                        required: true
                    }
                ],
                description:"Indica la ruta a utilizar como root por dev server"
            }
        ];
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
        new this._DevTask({
            sco:sco,
            server:server
        }).run();
    }
    protected _action(args,cb,command){
        console.log(args);
        let options = args.options||{};
        let sco;
        //if sco is provided as option
        if(args.sco){
            sco = args.sco;
            this._execute(sco,options);
        }else{//otherwise, try to scan the sco folder
            let config = this._ConfigService.getInstance().getConfig();
            //get dirs in sco folder
            let dirs = this._getDirs(this._path.join(config.homeDir,config.scoDir),config.scoTest);
            //if there is more than 1 sco folder, prompt to user
            if(dirs.length > 1) {
                command.prompt({
                    type: "list",
                    name: "sco",
                    message: "In which sco would you like to develop?",
                    choices:dirs
                },(result)=>{
                    this._execute(result.sco,options);
                });
            }else if(dirs.length == 1){//if only one folder is found, use it
                sco = dirs[0];
                this._execute(sco,options);
            }else{
                //todo error no sco found
            }
        }

    }
}