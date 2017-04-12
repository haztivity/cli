/**
 * Created by sokka on 11/04/2017.
 */

import {BaseCommand} from "../BaseCommand";
import {ConfigService, IHaztivityCliConfig} from "../../ConfigService";
export abstract class GulpBaseCommand extends BaseCommand{
    protected _commander;
    protected abstract _command:string;
    protected abstract _description:string;
    protected _configService:ConfigService;
    protected _haztivityConfig:IHaztivityCliConfig;
    protected _createCommand(){
        return `${this._command} ${this._stringifyArguments(this._arguments())}`;
    }
    protected _action(){
        this._configService = ConfigService.getInstance();
        this._haztivityConfig = this._configService.getConfig();
        if(this._haztivityConfig == undefined){
            process.exit(1);
        }
        require("../../loadTasks");
        this._task();
    };
    protected abstract _task();
}
