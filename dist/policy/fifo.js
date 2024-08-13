"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base")); // Assuming base.ts defines Policy
const object_sizeof_1 = __importDefault(require("object-sizeof"));
class FIFO extends base_1.default {
    queue;
    memory;
    monitor;
    logger;
    keyStore;
    constructor(options) {
        super('FIFO');
        this.queue = [];
        this.memory = options.memory;
        this.monitor = options.monitor;
        this.logger = options.logger;
        this.keyStore = new Map();
    }
    safe(data) {
        return (0, object_sizeof_1.default)(data) + this.memory.current <= this.memory.maxmemory;
    }
    keys() {
        return Array.from(this.memory.store.keys());
    }
    get(key) {
        if (!this.memory.has(key)) {
            return 'key not found';
        }
        this.monitor.hit();
        return this.memory.get(key);
    }
    async put(key, data) {
        try {
            if (this.memory.has(key)) {
                this.memory.set(key, data);
                return;
            }
            while (!this.safe(data)) {
                if (this.memory.isEmpty()) {
                    throw new Error('cache size is smaller than the data size');
                }
                await this.evict();
            }
            this.queue.push(key);
            this.memory.set(key, data);
        }
        catch (err) {
            this.logger.log(err, 'error');
        }
        finally {
            // No need for actions in a finally block here
        }
    }
    async evict() {
        const key = this.queue.shift();
        if (!key) {
            return; // Nothing to evict
        }
        try {
            this.memory.delete(key);
            this.monitor.evict();
        }
        catch (err) {
            this.logger.log(err, 'error');
        }
    }
}
exports.default = FIFO;
