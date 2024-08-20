"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Node {
    constructor(key, value, time = 0) {
        this.key = key;
        this.value = value;
        this.time = time;
        this.prev = null;
        this.next = null;
    }
}
exports.default = Node;
