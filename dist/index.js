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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const module_1 = __importDefault(require("./memory/module"));
const metric_1 = __importDefault(require("./metrics/metric"));
const encoder_1 = require("./encoding/encoder");
const logger_1 = __importDefault(require("./logger/logger"));
const index_1 = require("./policy/index");
const object_sizeof_1 = __importDefault(require("object-sizeof"));
class Cache {
    constructor(options = {}) {
        this.size = options.size || 5000;
        this.memory = new module_1.default({ limit: this.size });
        this.setCompression(options.compression);
        this.monitor = new metric_1.default(this.memory);
        this.logger = new logger_1.default({}, this.monitor);
        this.setPolicy(options.policy);
    }
    safe(data) {
        return (0, object_sizeof_1.default)(data) <= this.memory.maxmemory;
    }
    reset() {
        delete this.memory;
        this.memory = new module_1.default({ limit: this.size });
        delete this.monitor;
        this.monitor = new metric_1.default(this.memory);
        const type = this.policy.type();
        delete this.policy;
        this.policy = this.setPolicy(type);
    }
    keys() {
        return this.policy.keys();
    }
    setCompression(method) {
        try {
            this.compressor = encoder_1.compressorFactory.create(method);
        }
        catch (e) {
            console.error(e);
        }
    }
    setPolicy(policy) {
        try {
            this.policy = index_1.policyFactory.create(policy, { memory: this.memory, monitor: this.monitor, logger: this.logger });
        }
        catch (err) {
            this.logger.log(err, "error");
        }
    }
    setTTL(ttl) {
        try {
            if (this.policy.type() !== 'TTL') {
                throw new Error('policy not set to TTL');
            }
            this.policy.setTTL(ttl);
        }
        catch (err) {
            this.logger.log(err, "error");
        }
    }
    put(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.monitor.reference();
                if (!this.safe(data)) {
                    throw new Error("Data size exceeds cache size");
                }
                data = yield this.compressor.compress(data);
                yield this.policy.put(key, data);
            }
            catch (err) {
                this.logger.log(err, "error");
            }
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.monitor.reference();
            let data = yield this.policy.get(key);
            return yield this.compressor.decompress(data);
        });
    }
    hitRatio() {
        return this.monitor.hitRatio();
    }
    missRatio() {
        return this.monitor.missRatio();
    }
    memoryConsumption() {
        return this.monitor.memoryConsumption();
    }
    fillRate() {
        return this.monitor.fillRate();
    }
    evictionRate() {
        return this.monitor.evictionRate();
    }
    show() {
        this.logger.show();
    }
}
module.exports = Cache;
