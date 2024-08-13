"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
const dbl_1 = __importDefault(require("./dbl"));
const object_sizeof_1 = __importDefault(require("object-sizeof"));
class TTL extends base_1.default {
    memory;
    monitor;
    logger;
    ttl;
    head;
    tail;
    validity;
    constructor(options) {
        super('TTL');
        this.memory = options.memory;
        this.monitor = options.monitor;
        this.logger = options.logger;
        this.ttl = new Map();
        this.head = new dbl_1.default('dummy', 'dummy', -10);
        this.tail = new dbl_1.default('dummy', 'dummy', -10);
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.validity = 3600 * 1000; // One hour in milliseconds
    }
    expired(_key) {
        const node = this.memory.get(_key);
        if (!node)
            return true; // Consider expired if key doesn't exist
        const makeTime = node.time;
        return makeTime + this.validity < Date.now();
    }
    safe(data) {
        return (0, object_sizeof_1.default)(data) + this.memory.current <= this.memory.maxmemory;
    }
    keys() {
        return Array.from(this.memory.store.keys());
    }
    setTTL(validity) {
        this.validity = validity;
    }
    async get(_key) {
        if (!this.memory.has(_key)) {
            return 'key not found';
        }
        if (this.expired(_key)) {
            this.evict(_key);
            return 'key not found';
        }
        this.monitor.hit();
        return this.memory.get(_key).time;
    }
    async put(_key, data) {
        try {
            if (this.memory.has(_key)) {
                this.memory.get(_key).value = data;
                this.memory.get(_key).time = Date.now();
                return;
            }
            try {
                while (!this.safe(data)) {
                    if (this.memory.empty()) {
                        throw new Error('cache size is smaller than the data size');
                    }
                    await this.evict();
                }
            }
            finally {
                const newNode = new dbl_1.default(' ', data, Date.now());
                await this.add(newNode);
                console.time('set');
                this.memory.set(_key, newNode, (0, object_sizeof_1.default)(data));
                console.timeEnd('set');
            }
        }
        catch (err) {
            this.logger.log(err, 'error');
        }
    }
    async remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
        node = null;
    }
    async add(node) {
        node.prev = this.tail.prev;
        node.next = this.tail;
        this.tail.prev = node;
        node.prev.next = node;
    }
    async evict(...args) {
        const delNode = this.memory.get(args[0]) || this.head.next;
        const key = delNode.key;
        try {
            this.memory.delete(key);
            await this.remove(delNode);
            this.monitor.evict();
        }
        catch (err) {
            this.logger.log(err, 'error');
        }
    }
}
exports.default = TTL;
