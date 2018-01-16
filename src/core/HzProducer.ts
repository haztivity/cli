/**
 * @module core
 *//** */
import * as Sparky from "fuse-box/sparky";
import {
    HzBundle
} from "./HzBundle";
import {BundleProducer} from "fuse-box/core/BundleProducer";
import * as path from "path";
import * as extend from "extend";
import {SparkFlow} from "fuse-box/sparky/SparkFlow";
import {HzProducerOptions} from "./HzProducerOptions";
/**
 * Default options
 */
export const DEFAULTS:HzProducerOptions ={
    homeDir:"course",
    homeDist:"dist",
    mainTsFile:"index.ts",
    outputFile:"$name.js",
    server:{
        root:".",
        port:4444
    }
};
/**
 * Produce a group of bundles
 */
export class HzProducer{
    /**
     * Options for the runner
     */
    protected opts:HzProducerOptions;
    /**
     * Is production
     * @type {boolean}
     */
    protected isProduction:boolean = false;
    /**
     * Bundles to run
     */
    protected bundles:HzBundle[];
    /**
     * Fusebox flow for the common assets
     */
    protected commonAssetsFlow:SparkFlow;
    constructor(opts:HzProducerOptions={}){
        this.opts = opts;
    }

    /**
     * Add a sco to the process
     * @param bundle  Bundle to use
     */
    bundle(bundle:HzBundle){
        this.bundles.push(bundle);
    }
    /**
     * Mark as production
     */
    setProduction(){
        this.isProduction = true;
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

    /**
     * Stop watching changes for common assets
     */
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
     * Execute the bundles.
     * @returns {Promise<BundleProducer>}
     */
    async run():Promise<BundleProducer[]>{
        let bundles = this.bundles,
            promises:Promise<BundleProducer>[] =[];
        await this.clean();
        //in dev, only the first bundle will be executed
        if(!this.isProduction){
            bundles = [bundles[0]];
            this.watchCommonAssets();
        }else{
            await this.copyCommonAssets();
        }
        for (let bundleIndex = 0, bundlesLength = bundles.length; bundleIndex < bundlesLength; bundleIndex++) {
            let bundle = bundles[bundleIndex];
            promises.push(bundle.run());
        }
        return await Promise.all(promises);
    }
    /**
     * Get the options for the tasker merging the constructor parameters with the default options
     * @param {HzProducerOptions} options
     */
    protected getOptions(options:HzProducerOptions):HzProducerOptions{
        return extend(true,{},DEFAULTS,options);
    }

    /**
     * Get an array of Globs with the assets to copy/watch.
     * The assets MUSTN'T be part of any sco.
     * To handle assets inside of sco, use HzBundle
     * @returns {String[]}
     */
    protected getCommonAssetsToHandle():String[]{
        return [
            path.join("assets","**.(jpg|jpeg|png|gif|svg)"),
            path.join("assets","**.(ttf|otf|woff|woff2|eot)")
        ];
    }

}