"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
var src_1 = require("./src");
src_1.hzCli.producer(/** @class */ (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_1.prototype.getOptions = function (opts) {
        if (opts === void 0) { opts = {}; }
        opts.server = {
            root: "."
        };
        return _super.prototype.getOptions.call(this, opts);
    };
    class_1.prototype.getConfig = function () {
        var config = _super.prototype.getConfig.call(this);
        config.shim = {
            jquery: {
                source: "node_modules/jquery/dist/jquery.js",
                exports: "$",
            }
        };
        return config;
    };
    return class_1;
}(src_1.HzProducer)));
