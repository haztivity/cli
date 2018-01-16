/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {HzCli,HzProducer} from "./src";
import {FuseBoxOptions} from "fuse-box";
import {
    HzBundle,
    HzProducerOptions
} from "./src/core";
export default HzCli.init({
    bundler: {
        server: {
            root: "."
        }
    }
}).useBundle(class extends HzBundle{
    getFuseConfig():FuseBoxOptions{
        let config:FuseBoxOptions = super.getFuseConfig();
        config.shim = {
            jquery: {
                source: "node_modules/jquery/dist/jquery.js",
                exports: "$",
            }
        };
        return config;
    }
});