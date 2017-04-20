import {IHaztivityCliConfig} from "../ConfigService";
import * as FuseBoxStatic from "fuse-box"
import {FuseBoxOptions} from "fuse-box/dist/typings/core/FuseBox";
import {Plugin} from "fuse-box/dist/typings/core/WorkflowContext";
import * as vfs from "vinyl-fs";
import * as htmlReplace from "gulp-html-replace";
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
    protected _vfs = vfs;
    protected _htmlReplace = htmlReplace;
    protected _options:IFuseBoxTaskConfig;
    protected _homeDir:string;
    protected _outFile:string;
    constructor(options:IFuseBoxTaskConfig){
        // todo check if sco exists
        // todo validate options
        // create fusebox options
        this._options = options;
        this._homeDir = this._options.fusebox.homeDir;
        this._options.fusebox.homeDir = this._path.resolve(this._homeDir);
    }
    protected _parseOptions(){

    }
    protected _init(){

    }
    devServer(){
        this._outFile = this._path.join(this._options.outDir,this._options.sco,this._options.fusebox.outFile);
        this._options.fusebox.outFile = this._path.resolve(this._outFile);
        let fuse = this._FuseBox.init(this._options.fusebox);
        //find index.html in sco
        this._vfs.src(this._path.resolve(this._options.fusebox.homeDir,this._options.sco,"index.html"))
            .pipe(this._htmlReplace(
                {
                    "bundle":this._outFile
                },
                {
                    keepBlockTags:true,
                    resolvePaths:true
                }
            ))
            .pipe(this._vfs.dest((file)=>{
                return file.base;
            }));
        fuse.devServer(`>${this._path.join(this._options.sco,"index.ts").replace("\\","/")}`,this._options.server);
    }
    //bundle
    //devServer

}