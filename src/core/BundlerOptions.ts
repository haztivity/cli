/**
 * @module core
 *//** */
import {
    Server,
    ServerOptions
} from "fuse-box/devServer/Server";

/**
 * Options for the Bundler
 */
export interface BundlerOptions{
    /**
     * Name of the sco to bundle
     */
    sco?:string;
    /**
     * Is production
     */
    isProduction?:boolean;
    /**
     * Home dir for fuse
     * @see [FuseBox homeDir](https://fuse-box.org/page/configuration#home-directory)
     * @type {string}
     */
    homeDir?:string;
    /**
     * Directory where to write the bundles
     * @type {string}
     */
    homeDist?:string;
    /**
     * Main typescript file.
     * Will be used in the instructions call
     */
    mainTsFile?:string;
    /**
     * Name for the output file
     * @see [FuseBox Output](https://fuse-box.org/page/configuration#output)
     */
    outputFile?:string;
    /**
     * Fusebox server options
     */
    server?:ServerOptions;
    /**
     * Fusebox server function
     * @param {Server} server
     */
    serverFn?:{(server:Server):void};
}