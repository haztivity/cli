import {IHaztivityCliConfig} from "../ConfigService";
import * as FuseBoxStatic from "fuse-box"
import {FuseBoxOptions} from "fuse-box/dist/typings/core/FuseBox";
import {Plugin} from "fuse-box/dist/typings/core/WorkflowContext";
import * as path from "path";
export interface IFuseBoxServerOptions{
    root?:string;
    hmr?:boolean;
    port?:number;
}
export interface IFuseBoxTaskConfig{
    sco:string;
    outDir:string;
    fusebox:FuseBoxOptions;
    server?:IFuseBoxServerOptions
}
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
export class FuseboxTask{
    protected _FuseBoxStatic = FuseBoxStatic;
    protected _FuseBox = this._FuseBoxStatic.FuseBox;
    protected _path = path;
    protected _options:IFuseBoxTaskConfig;
    constructor(options:IFuseBoxTaskConfig){
        // todo check if sco exists
        // todo validate options
        // create fusebox options
        this._options = options;
    }
    protected _parseOptions(){

    }
    protected _init(){

    }
    devServer(){
        this._options.fusebox.outFile = this._path.join(this._options.outDir,this._options.sco,this._options.fusebox.outFile);
        let fuse = this._FuseBox.init(this._options.fusebox);
        fuse.devServer(`>${this._path.join(this._options.sco,"index.ts").replace("\\","/")}`,this._options.server);
    }
    //bundle
    //devServer

}