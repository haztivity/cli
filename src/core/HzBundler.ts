import {HzBundle} from "./HzBundle";
import {HzProducer} from "./HzProducer";
import {HzProducerOptions} from "./HzProducerOptions";
import {ScoBundlerOptions} from "./BundlerOptions";
import * as extend from "extend";
import {BundleProducer} from "fuse-box/core/BundleProducer";
/**
 * Bundler
 */
export class HzBundler{
    protected opts:HzProducerOptions;
    /**
     * HzBundle to use
     */
    protected bundleToUse:any = HzBundle;
    /**
     * HzProducer to use
     */
    protected producerToUse:any = HzProducer;
    protected producer:HzProducer;
    constructor(hzCli,opts){
        this.opts = opts;
        this.producer = new this.producerToUse(opts);
    }
    /**
     * Set the bundle class to use. Must be an instantiable class that extends from HzBundle
     * @param bundle
     */
    useBundle(bundle):HzBundler{
        if(bundle.prototype instanceof HzBundle == false){
            throw "The bundle must extends HzBundle class";
        }
        this.bundleToUse = bundle;
        return this;
    }
    /**
     * Set the producer class to use. Must be an instantiable class that extends from HzProducer
     * @param producer
     */
    useProducer(producer):HzBundler{
        if(producer.prototype instanceof HzProducer == false){
            throw "The producer must extends HzProducer class";
        }
        this.producerToUse = producer;
        return this;
    }

    /**
     * Add a sco to the process
     * @param name  Name of the sco. Must match with the folder name where the sco source is in the homeDir directory
     */
    bundle(name){
        this.producer.bundle(new this.producerToUse(name,this.producer));
    }
    async run():Promise<BundleProducer[]>{
        return await this.producer.run();
    }
}