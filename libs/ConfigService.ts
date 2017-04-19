/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as path from "path";
import * as extend from "extend";
import {FuseBoxOptions} from "fuse-box/dist/typings/core/FuseBox";
export interface IHaztivityCliConfig{
    homeDir?:string;
    scoTest?:string|RegExp;
    bundlesDir?:string;
    scoDir?:string;
    dev?:{
        server?:{
            root?:string;
            port?:number;
            hmr?:boolean;
        },
        fusebox?:FuseBoxOptions
    }
}
export class ConfigService{
    protected static readonly DEFAULTS:IHaztivityCliConfig = {
        homeDir:"course",
        scoTest:/sco*/i,
        scoDir:".",
        bundlesDir:"../bundles",
        dev:{
            server:{
                port:8080
            }
        }
    };
    protected static _instance:ConfigService;
    protected _config:IHaztivityCliConfig;
    protected _path = path;
    //protected _logger = Logger.getInstance();
    protected _extend = extend;
    constructor(){
        this.loadConfig();
    }
    protected _readConfigFile():IHaztivityCliConfig{
        let result = null;
        try{
            result = require(this._path.join(process.cwd(),"haztivitycli.config.js"));
            if(result.config){
                result = result.config;
            }
        }catch(e){
            //todo throw error
        }
        return result;
    }
    public loadConfig(){
        let config = this._readConfigFile();
        if(config){
            this._config = this._extend(true,{},ConfigService.DEFAULTS,config);
        }else{
            //todo throw error
            //this._logger.error("Haztivity","haztivitycli.config.js not found. Please init haztivity");
        }
        return this;
    }
    public getConfig():IHaztivityCliConfig{
        this.loadConfig();
        return this._config;
    }
    public static getInstance():ConfigService{
        if(!ConfigService._instance){
            ConfigService._instance = new ConfigService();
        }
        return ConfigService._instance;
    }
}