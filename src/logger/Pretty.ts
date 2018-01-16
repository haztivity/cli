/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as cliColor from "cli-color";
import * as ts from "typescript/lib/tsserverlibrary";
export class Pretty{
    protected _cliColor = cliColor;
    protected _log;
    protected _originalFactory;
    protected _originalMethod;
    constructor(log){
       this._log = log;
       this._originalFactory = log.methodFactory;
       this._log.methodFactory = this._formatterFactory.bind(this);
       this._log.setLevel(this._log.getLevel());
    }
    protected _formatterFactory(methodName,logLevel,loggerName){
        this._originalMethod = this._originalFactory(methodName,logLevel,loggerName);
        return this._formatter.bind(this,{methodName:methodName,logLevel:logLevel,loggerName:loggerName});
    };
    protected _formatter(logInfo,message){
        let level = `[${logInfo.methodName.toUpperCase()}]`;
        switch(logInfo.methodName){
            //case this._log.levels.DEBUG:
            //
            //    break;
            case "error":
                level=this._cliColor.red(level);
                break;
            case "info":
                level=this._cliColor.cyan(level);
                break;
            case "trace":
                level=this._cliColor.yellow(level);
                break;
            case "warn":
                level=this._cliColor.xterm(220)(level);
                break;
        }
        this._originalMethod(`${new Date().toISOString()} ${level} ${message}`);
    }
}