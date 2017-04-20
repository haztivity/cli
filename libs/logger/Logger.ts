/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as cliColor from "cli-color";
import * as logLevel from "loglevel";
import {Pretty} from "./Pretty";
export class Logger{
    protected static _instance:Logger;
    protected _log;
    public levels;
    public color;
    protected constructor(log){
        this._log = log;
        this.color =cliColor;
        new Pretty(this._log);
        this.levels = this._log.levels;
        this._log.setLevel(this._log.levels.INFO);
    }
    protected _parseMessages(messages){
        let result = [];
        for (let messageIndex = 0, messagesLength = messages.length; messageIndex < messagesLength; messageIndex++) {
            let current = messages[messageIndex];
            if(typeof current == "object"){
                current = JSON.stringify(current,null,4);
            }
            result[messageIndex] = current;
        }
        return result.join("");
    }
    getLogger(){
        return this._log;
    }
    setLevel(level){
        this._log.setLevel(level);
    }
    getLevel(){
        return this._log.getLevel();
    }
    info(...messages){
        this._log.info(this._parseMessages(messages));
    }
    warn(...messages){
        this._log.warn(this._parseMessages(messages));
    }
    error(...messages){
        this._log.error(this._parseMessages(messages));
    }
    trace(...messages){
        this._log.trace(this._parseMessages(messages));
    }
    debug(...messages){
        this._log.debug(this._parseMessages(messages));
    }
    static getInstance(){
        if(!Logger._instance){
            Logger._instance = new Logger(logLevel);
        }
        return Logger._instance;
    }
}