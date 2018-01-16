/**
 * @module core
 */import {
    Server,
    ServerOptions
} from "fuse-box/devServer/Server";

/** */
export interface HzProducerOptions{
    /**
     * Home dir for fuse.
     * This will be passed to bundles in the task.
     * This will be also used as base path for the assets
     * @see [FuseBox homeDir](https://fuse-box.org/page/configuration#home-directory)
     * @type {string}
     */
    homeDir?:string;
    /**
     * Directory where to write the bundles
     * This will be passed to bundles in the task.
     * This will be also used as base path for the assets
     * @type {string}
     */
    homeDist?:string;
    /**
     * Main typescript file for the bundles.
     * Will be used in the fusebox instructions call
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