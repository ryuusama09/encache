"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_sizeof_1 = require("object-sizeof"); // Import all members for potential future use
var Memory = /** @class */ (function () {
    function Memory(options) {
        this.store = new Map();
        this.maxmemory = options.limit;
        this.current = 0;
    }
    Memory.prototype.isEmpty = function () {
        return this.store.size === 0;
    };
    Memory.prototype.has = function (key) {
        return this.store.has(key);
    };
    Memory.prototype.set = function (key, value) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var wasPresent = this.has(key);
        this.store.set(key, value);
        this.current += wasPresent ? 0 : (0, object_sizeof_1.default)(args[0] || value);
    };
    Memory.prototype.get = function (key) {
        return this.has(key) ? this.store.get(key) : null;
    };
    Memory.prototype.delete = function (key) {
        var value = this.store.get(key);
        this.store.delete(key);
        if (value) {
            this.current -= (0, object_sizeof_1.default)(value);
        }
    };
    return Memory;
}());
exports.default = Memory;
