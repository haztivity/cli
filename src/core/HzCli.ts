import {Bundler} from "./Bundler";
import {TaskContext} from "./TaskContext";
import {TaskContextOptions} from "./TaskContextOptions";
import {BundlerOptions} from "./BundlerOptions";
import * as extend from "extend";
/**
 * HzCli context. Is a singleton class
 * Use HzCli.getInstance() to get the shared instance
 */
export class HzCli{
    protected static instance:HzCli;
    /**
     * Bundler to use
     */
    protected bundler:any = Bundler;
    /**
     * TaskContext to use
     */
    protected context:any = TaskContext;
    protected constructor(){
    }

    /**
     * Get an instance of the HzCli
     * @returns {HzCli}
     */
    static getInstance(){
        if(!HzCli.instance){
            HzCli.instance = new HzCli();
        }
        return HzCli.instance;
    }
    /**
     * Set the bundler to use. Must be an instantiable class that extends from Bundler
     * @param bundler
     */
    useBundler(bundler):HzCli{
        if(bundler.prototype instanceof Bundler == false){
            throw "The bundler must extends Bundler class";
        }
        this.bundler = bundler;
        return this;
    }

    /**
     * Set the context to use. Must be an instantiable class that extends from TaskContext
     * @param context
     * @param {TaskContextOptions} opts
     */
    useTaskContext(context):HzCli{
        if(context.prototype instanceof TaskContext == false){
            throw "The context must extends TaskContext class";
        }
        this.context = context;
        return this;
    }
    bundle(opts?:BundlerOptions){
        return new this.bundler(opts);
    }
    createContext(opts?:TaskContextOptions){
        return new this.context(opts);
    }
}