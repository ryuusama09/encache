"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
const dbl_1 = __importDefault(require("./dbl"));
const object_sizeof_1 = __importDefault(require("object-sizeof"));
class LRU extends base_1.default {
    memory;
    monitor;
    logger;
    lruMap;
    head;
    tail;
    constructor(options) {
        super('LRU');
        this.memory = options.memory;
        this.monitor = options.monitor;
        this.logger = options.logger;
        this.lruMap = new Map();
        this.head = new dbl_1.default('dummy', 'dummy');
        this.tail = new dbl_1.default('dummy', 'dummy');
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    safe(data) {
        return (0, object_sizeof_1.default)(data) + this.memory.current <= this.memory.maxmemory;
    }
    keys() {
        return Array.from(this.memory.store.keys());
    }
    add(node) {
        this.head.next.prev = node;
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next = node;
    }
    remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
        node.next = null;
        node.prev = null;
    }
    async get(key) {
        if (!this.memory.has(key)) {
            return 'key not found';
        }
        this.monitor.hit();
        const node = this.memory.get(key);
        const value = node.value;
        this.remove(node);
        const newNode = new dbl_1.default(' ', value);
        this.add(newNode);
        return value;
    }
    async put(key, data) {
        try {
            if (this.memory.has(key)) {
                const node = this.memory.get(key);
                this.remove(node);
                const newNode = new dbl_1.default(' ', data);
                this.add(newNode);
                this.memory.set(key, newNode, (0, object_sizeof_1.default)(data));
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
                const node = new dbl_1.default(' ', data);
                this.add(node);
                this.memory.set(key, node, (0, object_sizeof_1.default)(data));
            }
        }
        catch (err) {
            this.logger.log(err, 'error');
        }
    }
    async evict() {
        const delNode = this.tail.prev;
        const key = delNode.key;
        try {
            this.remove(delNode);
            this.memory.delete(key);
            this.monitor.evict();
        }
        catch (err) {
            this.logger.log(err, 'error');
        }
    }
}
exports.default = LRU;
