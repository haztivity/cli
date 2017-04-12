/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as extend from "extend";
import {JspmUtils} from "@sokka/gulp-build-tasks";
import {BaseTask} from "@sokka/gulp-build-tasks/libs/tasks/BaseTask";
import {IProcessParams, ITaskOptions,ITaskDestOptions,IJSPMBundleOptions} from "@sokka/gulp-build-tasks";
import {ConfigService,IHaztivityCliConfig} from "../../ConfigService";
import * as gulpHtmlReplace from "gulp-html-replace";
import * as notify from "node-notifier";
import * as gulpStreamToPromise from 'gulp-stream-to-promise';
import * as q from "q";
import {LoggerLevel} from "@sokka/gulp-build-tasks/libs/Logger";
const haztivityCliConfig = ConfigService.getInstance().getConfig();
export interface IBundleTaskOptions extends ITaskOptions{
    src?: string;
    dest?: string;
    options?:IJSPMBundleOptions;
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
            bundle:{
                src: "index.js",
                dest: "index.js"
            },
            options:{
                mangle:true,
                minify:true,
                lowResSourceMaps:true,
                sourceMaps:false
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
    protected _jspmUtils:JspmUtils = JspmUtils.getInstance();
    protected _jspm = this._jspmUtils.getJspm();
    protected _nodeNotify:notify.NodeNotifier = notify;
    protected _gulpStreamToPromise=gulpStreamToPromise;
    protected _gulpHtmlReplace = gulpHtmlReplace;
    protected _q=q;
    constructor(options:IHaztivityCliConfig){
        super();
        this._logger.setLevel(LoggerLevel.verbose);
        this._options = this._joinOptions(options);
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
            promise = defer.promise,
            src = this._options.bundle.src,
            dest = this._path.join(this._options.base,this._options.dest,this._options.bundle.dest);
            this._logger.info(`JSPM bundle-sfx expression:${src}, dest:${dest}`);
        try {
            let time = new Date();
            this._jspm.bundleSFX(src, dest, options).then(this._onBundleSuccess.bind(this, defer,time)).catch(this._onDistFail.bind(this, defer));
        }catch(e){
            defer.reject(e);
            this._onDistFail(defer,e);
        }
        return promise;
    }

    /**
     * Invocado al finalizarse la tarea satisfactoriamente
     * @private
     */
    protected _onDistSuccess(cb,time){
        let timeEnd = new Date();
        let timeSpent = (timeEnd.getTime()-time.getTime())/1000;
        this._logger.info(`bundle finished after ${timeSpent}s`);
        this._nodeNotify.notify({
            title:this._name,
            message:`Bundle created after ${timeSpent}s`
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
        this._logger.error(err.message);
    }

    /**
     * Invocado al generarse el bundle satisfactoriamente
     * @private
     */
    protected _onBundleSuccess(defer,time){
        let timeEnd = new Date();
        this._logger.log(`JSPM bundle-sfx created after ${(timeEnd.getTime()-time.getTime())/1000} s`);
        defer.resolve();
    }
    protected _copy(files,dest:ITaskDestOptions):Promise<any>{
        this._logger.info("Copying files");
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
            base = this._options.base;
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (let file of files) {
            result.push(this._path.join(base, file));
        }
        return result;
    }
    protected _replaceSystem(files,bundle,dest:ITaskDestOptions){
        this._logger.info("Replazing system scripts in files");
        let stream = this._vfs.src(files)
        //catch errors
            .pipe(this._gulpPlumber({errorHandler: this._gulpNotifyError()}))//notifyError generates the config
            //log src files if verbose
            .pipe(
                this._options.verbose
                    ? this._gulpDebug({title: this._getLogMessage("Files")})
                    : this._gutil.noop()
            )
            .pipe(
                this._gulpHtmlReplace(
                    {
                        system: "",
                        bundle:bundle,
                    },
                    {
                        keepUnassigned: false,
                        keepBlockTags: false
                    }
                )
            )
            .pipe(
                this._vfs.dest(
                    dest.path,
                    dest.options
                )
            );
        let promise = this._gulpStreamToPromise(stream);
        return promise;
    }
    protected _onBundleAndCopySuccess(cb,time,defer){
        this._replaceSystem([
            this._path.join(this._options.base,this._options.dest,"**/**.html")
        ],this._options.bundle.dest,{
            path: this._path.join(this._options.base,this._options.dest)
        }).then(this._onDistSuccess.bind(this,cb,time)).catch(this._onDistFail.bind(this,defer));
    }
    public run(cb,options:IRunConfig={}){
        let defer = this._q.defer(),
            jspmAvailable = this._jspmUtils.isAvailable();
        if(jspmAvailable == true) {
            let time = new Date();
            let _options = this._extend(true, {}, this._options.bundle.options || {}, options);
            let bundlePromise = this._makeBundle(_options);
            let files = this._resolveFiles(this._options.bundle.copy);
            let toExclude = this._joinExcludeFiles([],{jspm:false,npm:true,bower:true});
            let copyPromise = this._copy(
                toExclude.concat(files),
                {
                    path: this._path.join(this._options.base,this._options.dest)
                }
            );
            this._q.all([bundlePromise, copyPromise]).then(this._onBundleAndCopySuccess.bind(this, cb,time,defer)).catch(this._onDistFail.bind(this, defer));
        }else{
            this._logger.error("JSPM is not available:",jspmAvailable);
            process.exit(1);
        }
    }
}