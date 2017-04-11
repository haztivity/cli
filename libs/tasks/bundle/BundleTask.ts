/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as extend from "extend";
//import {JspmUtils} from "@sokka/gulp-build-tasks/JspmUtils";
import {BaseTask, IProcessParams, ITaskOptions,ITaskDestOptions} from "@sokka/gulp-build-tasks/libs/tasks/BaseTask";
import {ConfigService,IHaztivityCliConfig} from "../../ConfigService";
import * as path from "path";
import * as notify from "node-notifier";
import * as gulpStreamToPromise from 'gulp-stream-to-promise';
import * as q from "q";
import * as jspm from "jspm";
import {LoggerLevel} from "@sokka/gulp-build-tasks/libs/Logger";
const haztivityCliConfig = ConfigService.getInstance().getConfig();
export interface IBundleTaskOptions extends ITaskOptions{
    src?: string;
    dest?: string;
    options?:{
        mangle?:boolean;
        minify?:boolean;
        lowResSourceMaps?:boolean;
        sourceMaps?:boolean;
    };
    copy?:String[]
}
export interface IRunConfig{
    mangle?:boolean;
    minify?:boolean;
    lowResSourceMaps?:boolean;
    sourceMaps?:boolean;
}
/**
 * @class DiscTask
 * @extends BaseTask
 * @description Tarea de distribución
 */
export class BundleTask extends BaseTask{
    public static readonly NAME = "bundle";
    //extend from defaults of BaseTask
    protected static readonly DEFAULTS: IBundleTaskOptions = extend(
        true, {}, BaseTask.DEFAULTS, {
            src:path.join(haztivityCliConfig.src.path,"index.js"),
            dest:path.join(haztivityCliConfig.dest.path,"index.js"),
            options:{
                mangle:false,
                minify:false,
                lowResSourceMaps:true,
                sourceMaps:true
            },
            copy:[],
            notify: {
                success: {
                    timeout: 2000,
                    sound: false,
                    onLast: true
                },
                error: {
                    timeout: 5000,
                    sound: true,
                    onLast: true
                }
            }
        }
    );
    protected _name: string = "bundle";
    protected _options:IHaztivityCliConfig;
    protected _jspmUtils:JspmUtils;
    protected _nodeNotify:notify.NodeNotifier = notify;
    protected _gulpStreamToPromise=gulpStreamToPromise;
    protected _q=q;
    constructor(options:IHaztivityCliConfig){
        super();
        this._logger.setLevel(LoggerLevel.verbose);
        this._options = this._joinOptions(options);
        this._jspmUtils = jspm;//JspmUtils.getInstance();
    }

    protected _getDefaults(){
        return BundleTask.DEFAULTS;
    }
    /**
     * Genera el bundle mediante jspm
     * @param {IRunConfig}  options Configuración a aplicar
     * @private
     */
    protected _makeBundle(options:IRunConfig):Q.Promise<any>{
        //todo resolve src path
        let defer = this._q.defer(),
            src = this._path.join(this._options.src.path,this._options.bundle.src),
            dest = this._path.join(this._options.dest.path,this._options.bundle.dest);
            this._logger.log(this._name,`JSPM bundle-sfx src:${src}`);
            this._logger.log(this._name,`JSPM bundle-sfx dest:${dest}`);
        try {
            this._jspmUtils.bundleSFX(src, dest, options).then(this._onBundleSuccess.bind(this, defer)).catch(this._onDistFail.bind(this, defer));
        }catch(e){
            this._onDistFail(defer,e);
        }
        return defer.promise;
    }

    /**
     * Invocado al finalizarse la tarea satisfactoriamente
     * @private
     */
    protected _onDistSuccess(cb){
        this._nodeNotify.notify({
            title:this._name,
            message:"Bundle sfx created"
        });
        cb();
    }

    /**
     * Invocado al fallar la tarea
     * @param err
     * @private
     */
    protected _onDistFail(defer,err){
        this._nodeNotify.notify({
            title:this._name,
            message:err.stack
        });
        defer.reject(err);
        throw err;
    }

    /**
     * Invocado al generarse el bundle satisfactoriamente
     * @private
     */
    protected _onBundleSuccess(defer){
        defer.resolve();
    }
    protected _copy(files,dest:ITaskDestOptions):Promise<any>{
        let stream = this._vfs.src(files)
        //catch errors
            .pipe(this._gulpPlumber({errorHandler: this._gulpNotifyError()}))//notifyError generates the config
            //log src files if verbose
            .pipe(
                this._options.verbose
                    ? this._gulpDebug({title: this._getLogMessage("Files")})
                    : this._gutil.noop()
            ).pipe(
                this._vfs.dest(
                    dest.path,
                    dest.options
                )
            );
        let promise = this._gulpStreamToPromise(stream);
        return promise;
    }
    /**
     * Resolve the path of the files to watch prepending the src
     * @returns {Array}
     * @private
     */
    protected _resolveFiles(files) {
        let result = [],
            src = this._options.base;
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (let file of files) {
            result.push(this._path.join(src, file));
        }
        return result;
    }
    //make bundle
    //copy dependencies
    //copy others
    public run(cb,options:IRunConfig={}){
        let defer = this._q.defer();
        let _options = this._extend(true,{},this._options.bundle.options||{},options);
        let bundlePromise = this._makeBundle(_options);
        let copyPromise = this._copy(
            this._resolveFiles(this._options.bundle.copy),
            {
                path:this._options.dest.path
            }
        );
        this._q.all([bundlePromise,copyPromise]).then(this._onDistSuccess.bind(this,cb)).catch(this._onDistFail.bind(this,defer));
    }
}