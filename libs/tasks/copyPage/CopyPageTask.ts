import * as path from "path";
import * as fse from "fs-extra";
import * as glob from "glob";
import {Logger} from "../../logger/Logger";
export interface CopyPageOptions{
    /**
     * Page to copy. Must be a folder
     */
    copy?:string;
    /**
     * Target path for the copy
     */
    to?:string;
    /**
     * Copy the page over writing the existing files. False by default
     */
    force?:boolean;
}
export class CopyPageTask{
    protected _logger = Logger.getInstance();
    constructor(protected options:CopyPageOptions){

    }
    run(){
        let copy = path.normalize(this.options.copy),
            to = path.normalize(this.options.to);
        if(!fse.pathExistsSync(copy)){
            throw "Copy path doesn't exists:"+copy;
        }
        if(!!path.extname(copy)){
            throw "The origin must be a directory";
        }
        if(!!path.extname(to)){
            throw "The target must be a directory";
        }
        fse.ensureDirSync(to);
        if(this.options.force != true && fse.readdirSync(to).length>0){
            throw "The target must be an empty folder. To overwrite existing files use 'force' option";
        }
        fse.copySync(copy,to,{overwrite:true,recursive:true});
        const originName = copy.split(path.sep).pop();
        const name =  to.split(path.sep).pop();
        //get .ts,.js,.css,.scss
        const files = glob.sync(to+"/*.{ts,js,scss,stylus,less,css,mustache,pug,html,json}", { nodir: true });
        const regexp = new RegExp(originName,"gm");
        for(let file of files){
            try {
                this._logger.info(`Replacing '${originName}' for '${name}' in ${path.basename(file)}`);
                let content = fse.readFileSync(file, 'utf8');
                content = content.replace(regexp, name);
                fse.writeFileSync(file, content, "utf8");
            }catch(e){
                this._logger.error(`Error updating file ${file}`,e);
            }
        }
    }
}