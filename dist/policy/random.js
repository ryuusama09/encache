"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
const object_sizeof_1 = __importDefault(require("object-sizeof"));
class Random extends base_1.default {
    memory;
    monitor;
    logger;
    constructor(options) {
        super('RANDOM');
        this.memory = options.memory;
        this.monitor = options.monitor;
        this.logger = options.logger;
    }
    safe(data) {
        return (0, object_sizeof_1.default)(data) + this.memory.current <= this.memory.maxmemory;
    }
    async get(key) {
        if (!this.memory.has(key)) {
            return 'key not found';
        }
        this.monitor.hit();
        return this.memory.get(key);
    }
    keys() {
        return Array.from(this.memory.store.keys());
    }
    async put(key, data) {
        try {
            if (this.memory.has(key)) {
                this.memory.set(key, data);
                return;
            }
            while (!this.safe(data)) {
                if (this.memory.empty()) {
                    throw new Error('cache size is smaller than the data size');
                }
                await this.evict();
            }
            this.memory.set(key, data);
        }
        catch (err) {
            this.logger.log(err, 'error');
        }
        finally {
            // No action needed in the finally block as `memory.set` is already called conditionally.
        }
    }
    async evict() {
        const keyList = Array.from(this.memory.store.keys());
        const randomKey = keyList[Math.floor(Math.random() * keyList.length)];
        this.monitor.evict();
        this.memory.delete(randomKey);
    }
}
exports.default = Random;
