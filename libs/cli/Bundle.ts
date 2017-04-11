/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {GBTApi} from "@sokka/gulp-build-tasks";
import {BaseCommand, ICommandArgument} from "./BaseCommand";
export class BundleCommand extends BaseCommand{
    protected _command: string ="bundle";
    protected _description: string="Construye el proyecto y genera un paquete de distribución";

    protected _arguments(): ICommandArgument[] {
        return [];
    }

    protected _action() {
        GBTApi.getInstance().run("bundle");
    }
}