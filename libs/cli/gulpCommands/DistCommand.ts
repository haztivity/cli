/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {GBTApi} from "@sokka/gulp-build-tasks";
import {ICommandArgument} from "../BaseCommand";
import {GulpBaseCommand} from "./GulpBaseCommand";
export class DistCommand extends GulpBaseCommand{
    protected _command: string ="dist";
    protected _description: string="Construye el proyecto y genera un paquete de distribución";

    protected _arguments(): ICommandArgument[] {
        return [];
    }
    protected _action(){
        super._action();
    }
    protected _task() {
        GBTApi.getInstance().run("dist");
    }
}