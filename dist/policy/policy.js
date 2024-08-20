"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fifo_1 = __importDefault(require("./fifo"));
const lru_1 = __importDefault(require("./lru"));
const lfu_1 = __importDefault(require("./lfu"));
const ttl_1 = __importDefault(require("./ttl"));
const random_1 = __importDefault(require("./random"));
const noEviction_1 = __importDefault(require("./noEviction"));
class PolicyFactory {
    static create(type, options) {
        switch (type) {
            case 'FIFO':
                return new fifo_1.default(options);
            case 'LRU':
                return new lru_1.default(options);
            case 'LFU':
                return new lfu_1.default(options);
            case 'TTL':
                return new ttl_1.default(options);
            case 'RANDOM':
                return new random_1.default(options);
            case 'NO_EVICTION':
                return new noEviction_1.default(options);
            default:
                throw new Error('Invalid policy. Please choose from FIFO, LRU, LFU, TTL, RANDOM, NO_EVICTION');
        }
    }
}
exports.default = PolicyFactory;
