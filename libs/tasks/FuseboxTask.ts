import * as FuseBoxStatic from "fuse-box"
import {FuseBoxOptions} from "fuse-box/dist/typings/core/FuseBox";
import * as vfs from "vinyl-fs";
import * as htmlReplace from "gulp-html-replace";
import * as path from "path";
import * as mapStream from "map-stream";
import * as q from "q";
import {Logger} from "../logger/Logger";
export interface IFuseBoxServerOptions{
    root?:string;
    hmr?:boolean;
    port?:number;
}
export interface IFuseBoxTaskConfig{
    bundleExpression:string;
    sco:string;
    outDir:string;
    copy?:string[];
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
    protected _mapStream = mapStream;
    protected _htmlReplace = htmlReplace;
    protected _logger = Logger.getInstance();
    protected _q = q;
    protected _options:IFuseBoxTaskConfig;
    protected _homeDir:string;
    protected _outDirSco:string;
    protected _outFile:string;
    constructor(options:IFuseBoxTaskConfig){
        // todo check if sco exists
        // todo validate options
        // create fusebox options
        this._options = options;
        this._homeDir = this._options.fusebox.homeDir;
        this._options.fusebox.homeDir = this._path.resolve(this._homeDir);
        this._outDirSco = this._path.join(this._options.outDir,this._options.sco);
        this._outFile = this._path.join(this._outDirSco,this._options.fusebox.outFile);
    }
    protected _parseOptions(){

    }
    protected _init(){

    }
    protected _logFile(prefix,file,cb){
        this._logger.trace(prefix,this._logger.color.cyan(file.path));
        cb(null,file);
    }
    protected _copy(toCopy=[],target){
        this._logger.info("Copying files");
        this._logger.trace(`Dest directory: ${this._logger.color.cyan(target)} ,`,`\nGlobs to copy:\n`,toCopy,);
        let defer = this._q.defer();
        this._vfs.src(toCopy)
            .pipe(this._mapStream(this._logFile.bind(this,"Copy:")))
            .pipe(this._vfs.dest(target))
            .on('end',()=>defer.resolve());
        return defer.promise;
    }
    protected _injectBundlePath(toInject,bundlePath){
        let defer = this._q.defer();
        this._logger.info("Injecting bundle path");
        this._vfs.src(toInject)
            .pipe(this._mapStream(this._logFile.bind(this,this._logger.color.yellow("Search for inject in "))))
            .pipe(this._htmlReplace(
                {
                    "bundle":bundlePath
                },
                {
                    keepBlockTags:true,
                    resolvePaths:true
                }
            ))
            //write the same file
            .pipe(this._vfs.dest((file)=>{
                this._logger.info(this._logger.color.green("Injected bundle in "),this._logger.color.cyan(file.path));
                return file.base;
            }))
            .on('end',()=>defer.resolve());
        return defer.promise;
    }
    _initFuse(){
        this._options.fusebox.outFile = this._path.resolve(this._outFile);
        let fuse = this._FuseBox.init(this._options.fusebox);
        return fuse;
    }
    bundle(){
        this._logger.info(`Making bundle for sco ${this._logger.color.cyan(this._options.sco)}`);
        let defer = this._q.defer();
        let fuse = this._initFuse();
        let promise = this._copy(this._options.copy,this._path.resolve(this._options.outDir));
        promise.then(()=>{
            this._injectBundlePath(this._path.resolve(this._outDirSco,"**","*.html"),this._path.resolve(this._outFile)).then(()=>defer.resolve());
            this._logger.trace(`Bundle: sco path ${this._logger.color.cyan(this._path.resolve(this._options.fusebox.homeDir,this._options.sco))} to ${this._logger.color.cyan(this._path.resolve(this._outFile))}`);
            fuse.bundle(this._options.bundleExpression.replace("{{sco}}",this._options.sco).replace("\\","/"));
        });
        return defer.promise;
    }
    devServer(){
        this._logger.info(`Dev server for sco ${this._logger.color.cyan(this._options.sco)}`);
        let fuse = this._initFuse();
        console.log(this._path.resolve(this._path.resolve(this._homeDir,this._options.sco,"**","*.html")));
        let promise = this._injectBundlePath(this._path.resolve(this._homeDir,this._options.sco,"**","*.html"),this._outFile);
        promise.then(()=>{
            this._logger.trace(`Bundle: sco path ${this._logger.color.cyan(this._path.resolve(this._options.fusebox.homeDir,this._options.sco))} to ${this._logger.color.cyan(this._path.resolve(this._outFile))}`);
            fuse.devServer(this._options.bundleExpression.replace("{{sco}}",this._options.sco).replace("\\","/"),this._options.server);
        });
    }
    //bundle
    //devServer

}