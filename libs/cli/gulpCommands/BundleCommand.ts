/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {GBTApi} from "@sokka/gulp-build-tasks";
import {ICommandArgument} from "../BaseCommand";
import {GulpBaseCommand} from "./GulpBaseCommand";
export class BundleCommand extends GulpBaseCommand{
    protected _command: string ="bundle";
    protected _description: string="Genera un paquete de distribución";

    protected _arguments(): ICommandArgument[] {
        return [];
    }

    protected _task() {
        GBTApi.getInstance().run("bundle");
    }
}