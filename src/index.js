"use strict";
// This file is the entry point for the cache module.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// const policyFactory = require('./policy/policy')
// const memory = require('./memory/module')
// const monitor = require('./metrics/metric')
// const { compressorFactory, Compressor } = require('./encoding/encoder')
// const Logger = require('./logger/logger')
// const FIFO = require('./policy/fifo')
// const sizeof = require('object-sizeof')
// class cache {
//     constructor(size = 5000) {
//         this.size = size
//         this.memory = new memory(size)
//         this.compressor = new Compressor()
//         this.monitor = new monitor(this.memory)
//         this.policy = new FIFO(this.memory, this.monitor)
//         this.logger = new Logger({},this.monitor)
//     }
//     safe(data){
//         return sizeof(data) <= this.memory.maxmemory
//     }
//     reset(){
//         delete this.memory
//         this.memory = new memory(this.size)
//         delete this.monitor
//         this.monitor = new monitor(this.memory)
//         const type = this.policy.type()
//         delete this.policy
//         this.policy = policyFactory.create(type , this.memory , this.monitor , this.logger)
//     }
//     keys(){
//         return this.policy.keys()
//     }
//     setCompression(method) {
//         try {
//             this.compressor = compressorFactory.create(method)
//         } catch (e) {
//            console.error(e)
//         }
//     }
//     setPolicy(policy) {
//         try{
//             this.policy = policyFactory.create(policy, this.memory, this.monitor , this.logger)
//         } catch(err){
//            this.logger.log(err , "error")
//         }   
//     }
//     setTTL(ttl) {
//         try {
//             if (this.policy.type() !== 'TTL') { throw new Error('policy not set to TTL') }
//             this.policy.setTTL(ttl)
//         } catch (err) {
//             this.logger.log(err , "error")
//         }
//     }
//     async put(key, data) {
//         try{
//         this.monitor.reference()
//         if(!this.safe(data)){throw new Error("Data size exceeds cache size")}
//         data = await this.compressor.compress(data)
//         await this.policy.put(key, data)
//         }catch(err){
//             this.logger.log(err, "error")
//         }
//     }
//     async get(key) {
//         this.monitor.reference()
//         let data = await this.policy.get(key)
//         return await this.compressor.decompress(data)
//     }
//     hitRatio() {
//         return this.monitor.hitRatio()
//     }
//     missRatio() {
//         return this.monitor.missRatio()
//     }
//     memoryConsumption() {
//         return this.monitor.memoryConsumption()
//     }
//     fillRate() {
//         return this.monitor.fillRate()
//     }
//     evictionRate() {
//         return this.monitor.evictionRate()
//     }
//     show() {
//         this.logger.show()
//     }
// }
// module.exports = cache
var memory_1 = require("./memory");
var metrics_1 = require("./metrics");
var encoding_1 = require("./encoding");
var logger_1 = require("./logger");
var policy_1 = require("./policy");
var object_sizeof_1 = require("object-sizeof");
var Cache = /** @class */ (function () {
    function Cache(options) {
        if (options === void 0) { options = {}; }
        this.size = options.size || 5000;
        this.memory = new memory_1.default({ limit: this.size });
        this.compressor = new encoding_1.Compressor();
        this.monitor = new metrics_1.default(this.memory);
        this.logger = new logger_1.default({}, this.monitor);
        this.policy = new policy_1.FIFO({ memory: this.memory, monitor: this.monitor, logger: this.logger });
    }
    Cache.prototype.safe = function (data) {
        return (0, object_sizeof_1.default)(data) <= this.memory.maxmemory;
    };
    Cache.prototype.reset = function () {
        delete this.memory;
        this.memory = new memory_1.default({ limit: this.size });
        delete this.monitor;
        this.monitor = new metrics_1.default(this.memory);
        var type = this.policy.type();
        delete this.policy;
        this.policy = policy_1.policyFactory.create(type, { memory: this.memory, monitor: this.monitor, logger: this.logger });
    };
    Cache.prototype.keys = function () {
        return this.policy.keys();
    };
    Cache.prototype.setCompression = function (method) {
        try {
            this.compressor = encoding_1.compressorFactory.create(method);
        }
        catch (e) {
            console.error(e);
        }
    };
    Cache.prototype.setPolicy = function (policy) {
        try {
            this.policy = policy_1.policyFactory.create(policy, { memory: this.memory, monitor: this.monitor, logger: this.logger });
        }
        catch (err) {
            this.logger.log(err, "error");
        }
    };
    Cache.prototype.setTTL = function (ttl) {
        try {
            if (this.policy.type() !== 'TTL') {
                throw new Error('policy not set to TTL');
            }
            this.policy.setTTL(ttl);
        }
        catch (err) {
            this.logger.log(err, "error");
        }
    };
    Cache.prototype.put = function (key, data) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        this.monitor.reference();
                        if (!this.safe(data)) {
                            throw new Error("Data size exceeds cache size");
                        }
                        return [4 /*yield*/, this.compressor.compress(data)];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, this.policy.put(key, data)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.logger.log(err_1, "error");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Cache.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.monitor.reference();
                        return [4 /*yield*/, this.policy.get(key)];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, this.compressor.decompress(data)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Cache.prototype.hitRatio = function () {
        return this.monitor.hitRatio();
    };
    Cache.prototype.missRatio = function () {
        return this.monitor.missRatio();
    };
    Cache.prototype.memoryConsumption = function () {
        return this.monitor.memoryConsumption();
    };
    Cache.prototype.fillRate = function () {
        return this.monitor.fillRate();
    };
    Cache.prototype.evictionRate = function () {
        return this.monitor.evictionRate();
    };
    Cache.prototype.show = function () {
        this.logger.show();
    };
    return Cache;
}());
exports.default = Cache;
