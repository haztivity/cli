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
import {BundlerOptions} from "./BundlerOptions";
import {BundleProducer} from "fuse-box/core/BundleProducer";
import {SparkFlow} from "fuse-box/sparky/SparkFlow";
import {
    Server,
    ServerOptions
} from "fuse-box/devServer/Server";

/**
 * Default options
 */
export let DefaultBundlerOptions:BundlerOptions ={
    isProduction:false,
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
 * Represents a bundler for a sco. Ready to go
 * @use [fuse-box](https://fuse-box.org)
 */
export class Bundler {
    protected opts: BundlerOptions;
    /**
     * Fusebox instance
     */
    protected fuse: FuseBox;
    /**
     * Registered bundles. The key is the name of the bundle
     * @type {Map<string, Bundle>}
     */
    protected bundles: Map<string, Bundle> = new Map();
    /**
     * Sparky flow for watching files
     */
    protected assetsFlow: SparkFlow;

    constructor(options: BundlerOptions = {}) {
        this.opts = this.getOptions(options);
    }



    /**
     * Set the bundler for production
     */
    setProduction() {
        this.opts.isProduction = true;
    }

    /**
     * Get the sco path. Includes the home dir
     * @returns {string}
     */
    getScoPath() {
        return `${this.opts.homeDir}/${this.opts.sco}`;
    }

    /**
     * Get the dist parh for the sco. Includes the home dist
     * @returns {string}
     */
    getDistPath() {
        return `${this.opts.homeDist}/${this.opts.sco}`;
    }

    /**
     * Initialize the fusebox with the configuration defined in getConfig
     * @returns {FuseBox}
     */
    initFuseBox(): FuseBox {
        this.fuse = FuseBox.init(this.getConfig());
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
        await Sparky.src(this.getAssetsToHandle(), {base: this.opts.homeDir}).dest(this.opts.homeDist).exec();
    }

    /**
     * Watch all the assets defined with getAssetsToHandle. If a file that matches with the globs changes, the file will be copied to the dist
     * @returns {Promise<void>}
     */
    watchAssets():SparkFlow {
        this.assetsFlow = Sparky.watch(this.getAssetsToHandle(), {base: this.opts.homeDir}).dest(this.opts.homeDist);
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
        this.fuse.dev(this.opts.server,this.opts.serverFn);
    }
    /**
     * Run the fusebox bundler
     * @param opts
     */
    async run(opts?: any): Promise<BundleProducer> {
        return await this.fuse.run(opts);
    }
    /**
     * Get the options for the bundler merging the constructor parameters with the default options
     * @param {BundlerOptions} options
     */
    protected getOptions(options: BundlerOptions): BundlerOptions {
        return extend(true, {}, DefaultBundlerOptions, options);
    }

    /**
     * Get an array of Globs with the assets to copy/watch.
     * The assets MUST be part of the sco.
     * To handle assets outside of sco, use Tasker
     * @returns {String[]}
     */
    protected getAssetsToHandle(): String[] {
        return [
            path.join(this.opts.sco, "**.(jpg|jpeg|png|gif|svg)"),
            path.join(this.opts.sco, "**.(ttf|otf|woff|woff2|eot)")
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
            this.opts.isProduction && UglifyESPlugin()
        ];
    }

    /**
     * Get the fusebox options to use. Use the plugins of getPlugins
     * @returns {FuseBoxOptions}
     */
    protected getConfig(): FuseBoxOptions {
        return {
            homeDir: this.opts.homeDir,
            output: path.join(this.getDistPath(), this.opts.outputFile),
            target: "browser",
            hash: this.opts.isProduction,
            cache: false,
            sourceMaps: !this.opts.isProduction,
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
        const sco = this.fuse.bundle(this.opts.sco);
        if (!this.opts.isProduction) {
            sco.watch();
        }
        sco.instructions(`>[${this.opts.sco}/${this.opts.mainTsFile}]`);
        this.bundles.set(this.opts.sco, sco);
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
        if (!this.opts.isProduction) {
            vendor.watch();
        }
        vendor.instructions(`~ ${this.opts.sco}/${this.opts.mainTsFile}`);
        this.bundles.set("vendor", vendor);
        return vendor;
    }
}