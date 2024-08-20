"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Policy {
    constructor(name) {
        this.name = name;
    }
    type() {
        return this.name;
    }
    get(...args) { }
    put(...args) { }
    safe(...args) { }
    evict(...args) { }
}
exports.default = Policy;
