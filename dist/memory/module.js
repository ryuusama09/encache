"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const object_sizeof_1 = __importDefault(require("object-sizeof")); // Import all members for potential future use
class Memory {
    store;
    maxmemory;
    current;
    constructor(options) {
        this.store = new Map();
        this.maxmemory = options.limit;
        this.current = 0;
    }
    empty() {
        return this.store.size === 0;
    }
    has(key) {
        return this.store.has(key);
    }
    set(key, value, ...args) {
        const wasPresent = this.has(key);
        this.store.set(key, value);
        this.current += wasPresent ? 0 : (0, object_sizeof_1.default)(args[0] || value);
    }
    get(key) {
        return this.has(key) ? this.store.get(key) : null;
    }
    delete(key) {
        const value = this.store.get(key);
        this.store.delete(key);
        if (value) {
            this.current -= (0, object_sizeof_1.default)(value);
        }
    }
}
exports.default = Memory;
