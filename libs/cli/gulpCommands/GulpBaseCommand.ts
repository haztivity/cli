/**
 * Created by sokka on 11/04/2017.
 */

import {BaseCommand} from "../BaseCommand";
export abstract class GulpBaseCommand extends BaseCommand{
    protected _commander;
    protected abstract _command:string;
    protected abstract _description:string;
    protected _createCommand(){
        return `${this._command} ${this._stringifyArguments(this._arguments())}`;
    }
    protected _action(){
        require("../../loadTasks");
        this._task();
    };
    protected abstract _task();
}
