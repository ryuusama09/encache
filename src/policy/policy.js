"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fifo_1 = require("./fifo");
var lru_1 = require("./lru");
var lfu_1 = require("./lfu");
var ttl_1 = require("./ttl");
var random_1 = require("./random");
var noEviction_1 = require("./noEviction");
var PolicyFactory = /** @class */ (function () {
    function PolicyFactory() {
    }
    PolicyFactory.create = function (type, options) {
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
    };
    return PolicyFactory;
}());
exports.default = PolicyFactory;
