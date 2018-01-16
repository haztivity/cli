/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {HzCli,Bundler} from "./src";
import {FuseBoxOptions} from "fuse-box";
import {BundlerOptions} from "./src/core";
HzCli.getInstance().useBundler(class extends Bundler{
    getOptions(opts:BundlerOptions={}):BundlerOptions{
        opts.server = {
            root:"."
        };
        return super.getOptions(opts);
    }
    getConfig():FuseBoxOptions{
        let config:FuseBoxOptions = super.getConfig();
        config.shim = {
            jquery: {
                source: "node_modules/jquery/dist/jquery.js",
                exports: "$",
            }
        };
        return config;
    }
});