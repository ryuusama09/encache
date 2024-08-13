"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Node = /** @class */ (function () {
    function Node(key, value, time) {
        if (time === void 0) { time = 0; }
        this.key = key;
        this.value = value;
        this.time = time;
        this.prev = null;
        this.next = null;
    }
    return Node;
}());
exports.default = Node;
