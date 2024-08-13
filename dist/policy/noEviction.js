"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
const object_sizeof_1 = __importDefault(require("object-sizeof"));
class NoEviction extends base_1.default {
    memory;
    monitor;
    logger;
    constructor(options) {
        super('NO_EVICTION');
        this.memory = options.memory;
        this.monitor = options.monitor;
        this.logger = options.logger;
    }
    safe(data) {
        return (0, object_sizeof_1.default)(data) + this.memory.current <= this.memory.maxmemory;
    }
    keys() {
        return Array.from(this.memory.store.keys());
    }
    async get(key) {
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
            if (!this.safe(data)) {
                this.logger.log(`Cannot Insert ${key}, Data size exceeds cache size`, 'warn');
                return;
            }
            this.memory.set(key, data);
        }
        catch (err) {
            this.logger.log(err, 'error');
        }
    }
}
exports.default = NoEviction;
