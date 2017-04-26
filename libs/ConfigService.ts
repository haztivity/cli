/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as path from "path";
import * as extend from "extend";
import {FuseBoxOptions} from "fuse-box/dist/typings/core/FuseBox";
import {Logger} from "./logger/Logger";
import * as UglifyJS from "uglify-js";
import {Options} from "node-sass";
export const enum LogLevel {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    SILENT = 5
}
export interface IHaztivityCliConfig{
    homeDir?:string;
    scoTest?:string|RegExp;
    scoDir?:string;
    dev?:{
        bundleExpression?:string;
        outputDir?:string;
        server?:{
            root?:string;
            port?:number;
            hmr?:boolean;
        },
        fusebox?:FuseBoxOptions,
        sass?:Options
    },
    dist?:{
        bundleExpression?:string;
        outputDir?:string;
        fusebox?:FuseBoxOptions;
        copy?:string[];
        uglify?:any,
        sass?:Options
    },
    logLevel?:LogLevel
}
export class ConfigService{
    protected static readonly DEFAULTS:IHaztivityCliConfig = {
        homeDir:"course",
        scoTest:/sco*/i,
        scoDir:".",
        dev:{
            bundleExpression:">{{sco}}/index.ts",
            outputDir:"bundles",
            server:{
                port:8080
            },
            fusebox:{
                outFile:"bundle.js",
                sourceMaps:true
            }
        },
        dist:{
            bundleExpression:">{{sco}}/index.ts",
            outputDir:"dist",
            copy:[
                "**/*.(ttf|otf|woff|wof2|eot)",
                "{{homeDir}}/**/*.(jpg|png|jpeg|gif)",
                "{{homeDir}}/**/index.html"
            ],
            fusebox:{
                outFile:"bundle.js"
            }
        },
        logLevel:LogLevel.INFO
    };
    protected static _instance:ConfigService;
    protected _logger = Logger.getInstance();
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
            this._logger.error("Fail to read haztivitycli.config.js. Maybe it's malformed?",`Detail:${e.message}`);
        }
        return result;
    }

    protected _processConfig(config){
        if(config.dist && config.dist.copy){
            let copy = config.dist.copy;
            let homeDir = config.homeDir.replace(/^(\.\\|\.\/)/g,"");//replace .\ or ./ starts
            for (let copyPath = 0, copyLength = copy.length; copyPath < copyLength; copyPath++) {
                let current = copy[copyPath];
                copy[copyPath] = current.replace("{{homeDir}}",homeDir);
            }
        }
        return config;
    }
    public loadConfig(){
        let config = this._readConfigFile();
        if(config){
            let distCopy = config && config.dist && config.dist.copy ? config.dist.copy : [];
            config = this._extend(true,{},ConfigService.DEFAULTS,config);
            if(distCopy.length > 0){
                config.dist.copy = distCopy;
            }
            this._config = this._processConfig(config);
            if(this._config.logLevel != undefined){
                this._logger.setLevel(this._config.logLevel);
            }
        }else{
            //todo throw error
            this._logger.error("haztivitycli.config.js not found. Please init use 'hzcli' and 'init'");
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