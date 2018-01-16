/**
 * @module core
 *//** */
export interface TaskContextOptions{
    /**
     * Home dir for fuse.
     * This will be passed to bundlers in the task.
     * This will be also used as base path for the assets
     * @see [FuseBox homeDir](https://fuse-box.org/page/configuration#home-directory)
     * @type {string}
     */
    homeDir?:string;
    /**
     * Directory where to write the bundles.
     * This will be passed to bundlers in the task.
     * This will be also used for the assets
     * @type {string}
     */
    homeDist?:string;
}