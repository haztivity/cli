import {HzBundler} from "./HzBundler";

export class HzCli{
    protected opts;
    static init(opts){

    }
    getBundler(){
        return new HzBundler(this,this.opts.bundler);
    }
}