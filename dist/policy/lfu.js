"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
const dbl_1 = __importDefault(require("./dbl"));
const object_sizeof_1 = __importDefault(require("object-sizeof"));
class LFU extends base_1.default {
    constructor(options) {
        super('LFU');
        this.memory = options.memory;
        this.monitor = options.monitor;
        this.lfuMap = new Map();
        this.head = new dbl_1.default(0, 'dummy');
        this.tail = new dbl_1.default(0, 'dummy');
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.address = new Map();
        this.lastInGroup = new Map();
        this.freq = new Map();
        this.groupMembersCount = new Map();
        this.keyStore = new Map();
    }
    safe(data) {
        return (0, object_sizeof_1.default)(data) + this.memory.current <= this.memory.maxmemory;
    }
    keys() {
        return Array.from(this.memory.store.keys());
    }
    get(key_1) {
        return __awaiter(this, arguments, void 0, function* (key, toHit = true) {
            if (!this.memory.has(key)) {
                return 'key not found';
            }
            if (toHit) {
                this.monitor.hit();
            }
            const node = this.address.get(key);
            this.cyclicallyRotateLeft(node, this.lastInGroup.get(this.freq.get(key)));
            this.groupMembersCount.set(this.freq.get(key), this.groupMembersCount.get(this.freq.get(key)) - 1);
            if (this.groupMembersCount.get(this.freq.get(key)) === 0) {
                this.groupMembersCount.delete(this.freq.get(key));
                this.lastInGroup.delete(this.freq.get(key));
            }
            this.freq.set(key, this.freq.get(key) + 1);
            this.groupMembersCount.set(this.freq.get(key), (this.groupMembersCount.get(this.freq.get(key)) || 0) + 1);
            if (this.groupMembersCount.get(this.freq.get(key)) === 1) {
                this.lastInGroup.set(this.freq.get(key), node);
            }
            if (this.groupMembersCount.has(this.freq.get(key) - 1)) {
                this.lastInGroup.set(this.freq.get(key) - 1, node.prev);
            }
            this.cyclicallyRotateLeft(node, this.lastInGroup.get(this.freq.get(key)));
            this.lastInGroup.set(this.freq.get(key), node);
            return this.memory.get(key);
        });
    }
    put(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.address.has(key)) {
                this.address.get(key).value = value;
                this.memory.set(key, value);
                this.get(key, false);
                return;
            }
            while (!this.safe(value)) {
                if (this.memory.empty()) {
                    throw new Error('cache size is smaller than the data size');
                }
                yield this.evict();
            }
            this.memory.set(key, value);
            let newLfu = new dbl_1.default(key, value);
            let lfu = this.head.next;
            lfu.prev = newLfu;
            newLfu.next = lfu;
            this.head.next = newLfu;
            newLfu.prev = this.head;
            this.address.set(key, newLfu);
            this.freq.set(key, 1);
            this.groupMembersCount.set(1, (this.groupMembersCount.get(1) || 0) + 1);
            if (this.groupMembersCount.get(1) === 1) {
                this.lastInGroup.set(1, newLfu);
            }
            this.cyclicallyRotateLeft(newLfu, this.lastInGroup.get(1));
            this.lastInGroup.set(1, newLfu);
        });
    }
    evict() {
        return __awaiter(this, void 0, void 0, function* () {
            let lfu = this.head.next;
            let newLfu = lfu.next;
            this.head.next = newLfu;
            newLfu.prev = this.head;
            this.address.delete(lfu.key);
            this.memory.delete(lfu.key);
            this.monitor.evict();
            this.groupMembersCount.set(this.freq.get(lfu.key), (this.groupMembersCount.get(lfu.key)) - 1);
            this.freq.set(lfu.key, (this.freq.get(lfu.key)) - 1);
            if (this.groupMembersCount.get(this.freq.get(lfu.key)) === 0) {
                this.groupMembersCount.delete(this.freq.get(lfu.key));
                this.lastInGroup.delete(this.freq.get(lfu.key));
            }
            if (this.freq.get(lfu.key) === 0) {
                this.freq.delete(lfu.key);
            }
        });
    }
    cyclicallyRotateLeft(L, R) {
        if (L === R) {
            return;
        }
        const a = L.prev;
        const b = R.next;
        a.next = L.next;
        L.next.prev = a;
        L.next = b;
        b.prev = L;
        R.next = L;
        L.prev = R;
    }
}
exports.default = LFU;
