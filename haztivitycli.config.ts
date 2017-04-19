/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {ConfigService,IHaztivityCliConfig} from "./libs/ConfigService";
export const config:IHaztivityCliConfig = {
    homeDir:"./test/course",
    scoTest:/sco*/,
    dev:{
        server:{
            root:".",
            port:4444,
            hmr:true
        },
        fusebox:{
            cache:true,
            log:true,
            debug:true
        }
    }
};