"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Policy = /** @class */ (function () {
    function Policy(name) {
        this.name = name;
    }
    Policy.prototype.type = function () {
        return this.name;
    };
    Policy.prototype.get = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    Policy.prototype.put = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    Policy.prototype.safe = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    Policy.prototype.evict = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    return Policy;
}());
exports.default = Policy;
