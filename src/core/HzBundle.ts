/**
 * @module core
 *//** */
import {
    FuseBox,
    WebIndexPlugin,
    SassPlugin,
    CSSPlugin,
    JSONPlugin,
    HTMLPlugin,
    UglifyESPlugin,
    FuseBoxOptions,
    Plugin,
    Bundle
} from "fuse-box";
import * as Sparky from "fuse-box/sparky";
import {PugPlugin} from "fusebox-pug-plugin";
import * as path from "path";
import * as extend from "extend";
import {ScoBundlerOptions} from "./BundlerOptions";
import {BundleProducer} from "fuse-box/core/BundleProducer";
import {SparkFlow} from "fuse-box/sparky/SparkFlow";
import {
    Server,
    ServerOptions
} from "fuse-box/devServer/Server";

/**
 * Represents a bundle for a sco.
 * @use [fuse-box](https://fuse-box.org)
 */
export class HzBundle {
    /**
     * Name of the sco.
     * Will be used to name the fusebox bundle
     */
    protected sco:string;
    /**
     * Fusebox instance
     */
    protected fuse: FuseBox;
    /**
     * Fusebox bundles. The key is the name of the bundle
     * @type {Map<string, Bundle>}
     */
    protected bundles: Map<string, Bundle> = new Map();
    /**
     * Sparky flow for watching files
     */
    protected assetsFlow: SparkFlow;
    protected producer;
    constructor(sco:string,producer) {
        this.sco = sco;
        this.producer = producer;
    }

    /**
     * Get the sco path. Includes the home dir
     * @returns {string}
     */
    getScoPath() {
        return `${this.producer.opts.homeDir}/${this.sco}`;
    }

    /**
     * Get the dist parh for the sco. Includes the home dist
     * @returns {string}
     */
    getDistPath() {
        return `${this.producer.opts.homeDist}/${this.sco}`;
    }

    /**
     * Initialize the fusebox with the configuration defined in getFuseConfig
     * @returns {FuseBox}
     */
    initFuseBox(): FuseBox {
        this.fuse = FuseBox.init(this.getFuseConfig());
        return this.fuse;
    }

    /**
     * Create all the bundles
     */
    createBundles() {
        this.createScoBundle();
        this.createVendorBundle();
    }


    /**
     * Copy all the assets defined with getAssetsToHandle
     * @returns {Promise<void>}
     */
    async copyAssets() {
        await Sparky.src(this.getAssetsToHandle(), {base: this.producer.opts.homeDir}).dest(this.producer.opts.homeDist).exec();
    }

    /**
     * Watch all the assets defined with getAssetsToHandle. If a file that matches with the globs changes, the file will be copied to the dist
     * @returns {Promise<void>}
     */
    watchAssets():SparkFlow {
        this.assetsFlow = Sparky.watch(this.getAssetsToHandle(), {base: this.producer.opts.homeDir}).dest(this.producer.opts.homeDist);
        this.assetsFlow.exec();
        return this.assetsFlow;
    }

    /**
     * Stop watching assets
     */
    stopWatchingAssets(){
        if(this.assetsFlow) {
            this.assetsFlow.stopWatching();
        }
    }

    /**
     * Run the development mode of fusebox
     */
    dev(){
        this.fuse.dev(this.producer.opts.server,this.producer.opts.serverFn);
    }
    /**
     * Run the fusebox bundler
     * @param opts
     */
    async run(opts?: any): Promise<BundleProducer> {
        if(this.producer.isProduction){
            await this.copyAssets();
        }else{
            this.watchAssets();
        }
        this.initFuseBox();
        this.createBundles();
        return await this.fuse.run(opts);
    }


    /**
     * Get an array of Globs with the assets to copy/watch.
     * The assets MUST be part of the sco.
     * To handle assets outside of sco, use Tasker
     * @returns {String[]}
     */
    protected getAssetsToHandle(): String[] {
        return [
            path.join(this.sco, "**.(jpg|jpeg|png|gif|svg)"),
            path.join(this.sco, "**.(ttf|otf|woff|woff2|eot)")
        ];
    }

    /**
     * Get the plugins to use
     * @returns {Plugin[]}
     */
    protected getPlugins(): Plugin[] {
        return [
            WebIndexPlugin({
                title: '',
                template: path.join(this.getScoPath(), "index.html"),
            }),
            [
                SassPlugin({
                    //@ts-ignore
                    outputStyle: 'compressed',
                    importer: true
                }),
                CSSPlugin(),
            ],
            CSSPlugin(),
            JSONPlugin(),
            HTMLPlugin({
                useDefault: false,
            }),
            PugPlugin(),
            this.producer.isProduction && UglifyESPlugin()
        ];
    }

    /**
     * Get the fusebox options to use. Use the plugins of getPlugins
     * @returns {FuseBoxOptions}
     */
    protected getFuseConfig(): FuseBoxOptions {
        return {
            homeDir: this.producer.opts.homeDir,
            output: path.join(this.getDistPath(), this.producer.opts.outputFile),
            target: "browser",
            hash: this.producer.isProduction,
            cache: this.producer.opts.cache,
            sourceMaps: !this.producer.isProduction,
            plugins: this.getPlugins()
        }
    }

    /**
     * Creates the bundle for the sco
     * If the bundler is not set for production, the sco will be watched for changes.
     * The name of the bundle will be the name of the sco
     * The bundle is stored in the bundles map
     * @returns {Bundle}
     */
    protected createScoBundle(): Bundle {
        const sco = this.fuse.bundle(this.sco);
        if (!this.producer.isProduction) {
            sco.watch();
        }
        sco.instructions(`>[${this.sco}/${this.producer.opts.mainTsFile}]`);
        this.bundles.set(this.sco, sco);
        return sco;
    }

    /**
     * Creates the bundle for the vendor.
     * If the bundler is not set for production, the vendor will be watched for changes.
     * The name of the bundle will be "vendor"
     * The bundle is stored in the bundles map
     * @returns {Bundle}
     */
    protected createVendorBundle(): Bundle {
        const vendor = this.fuse.bundle("vendor");
        if (!this.producer.isProduction) {
            vendor.watch();
        }
        vendor.instructions(`~ ${this.sco}/${this.producer.opts.mainTsFile}`);
        this.bundles.set("vendor", vendor);
        return vendor;
    }
}