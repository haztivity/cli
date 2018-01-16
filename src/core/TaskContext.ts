/**
 * @module core
 *//** */
import * as Sparky from "fuse-box/sparky";
import {
    Bundler,
    DefaultBundlerOptions
} from "./Bundler";
import {BundleProducer} from "fuse-box/core/BundleProducer";
import * as path from "path";
import * as extend from "extend";
import {SparkFlow} from "fuse-box/sparky/SparkFlow";
import {TaskContextOptions} from "./TaskContextOptions";
export class TaskContext{
    protected opts:TaskContextOptions;
    protected bundlers:Bundler[];
    protected commonAssetsFlow:SparkFlow;
    constructor(options:TaskContextOptions={}){
        this.opts = this.getOptions(options);
    }
    /**
     * Copy all the assets defined with getCommonAssetsToHandle
     * @returns {Promise<void>}
     */
    async copyCommonAssets(){
        await Sparky.src(this.getCommonAssetsToHandle(),{base:this.opts.homeDir}).dest(this.opts.homeDist).exec();
    }
    /**
     * Watch all the assets defined with getCommonAssetsToHandle. If a file that matches with the globs changes, the file will be copied to the dist
     * @returns {Promise<void>}
     */
    watchCommonAssets():SparkFlow{
        this.commonAssetsFlow = Sparky.watch(this.getCommonAssetsToHandle(),{base:this.opts.homeDir}).dest(this.opts.homeDist);
        this.commonAssetsFlow.exec();
        return this.commonAssetsFlow;
    }
    stopWatchCommonAssets(){
        if(this.commonAssetsFlow){
            this.commonAssetsFlow.stopWatching();
        }
    }
    /**
     * Clean the dist path
     * @returns {Promise<void>}
     */
    async clean(){
        Sparky.src(this.opts.homeDist).clean(this.opts.homeDist).exec()
    }
    /**
     * Execute in distribution mode all the bundlers
     * @returns {Promise<BundleProducer>}
     */
    async dist():Promise<BundleProducer[]>{
        await this.clean();
        let bundlers = this.bundlers,
            promises:Promise<BundleProducer>[] =[];
        for (let bundlerIndex = 0, bundlersLength = bundlers.length; bundlerIndex < bundlersLength; bundlerIndex++) {
            let currentBundler = bundlers[bundlerIndex];
            promises.push(this.runDistBundler(currentBundler));
        }
        return await Promise.all(promises);
    }

    /**
     * Execute in development mode the first bundler
     * @returns {Promise<BundleProducer>}
     */
    async dev():Promise<BundleProducer>{

        //in dev, only the first bundler will be userd
        let bundler = this.bundlers[0];
        if(!bundler){
            await this.clean();
            bundler.initFuseBox();
            bundler.watchAssets();
            bundler.dev();
            bundler.createBundles();
            return await bundler.run();
        }else{
            //todo error
        }
    }

    /**
     * Run a single bundler for distribution mode
     * @param {Bundler} bundler
     * @returns {Promise<BundleProducer>}
     */
    protected async runDistBundler(bundler:Bundler):Promise<BundleProducer>{
        bundler.setProduction();
        await bundler.copyAssets();
        bundler.initFuseBox();
        bundler.createBundles();
        return await bundler.run();
    }
    /**
     * Get the options for the tasker merging the constructor parameters with the default options
     * @param {TaskContextOptions} options
     */
    protected getOptions(options:TaskContextOptions):TaskContextOptions{
        return extend(true,{},DefaultBundlerOptions,options);
    }

    /**
     * Get an array of Globs with the assets to copy/watch.
     * The assets MUSTN'T be part of any sco.
     * To handle assets inside of sco, use Bundler
     * @returns {String[]}
     */
    protected getCommonAssetsToHandle():String[]{
        return [
            path.join("assets","**.(jpg|jpeg|png|gif|svg)"),
            path.join("assets","**.(ttf|otf|woff|woff2|eot)")
        ];
    }

}