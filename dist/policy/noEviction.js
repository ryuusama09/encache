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
const object_sizeof_1 = __importDefault(require("object-sizeof"));
class NoEviction extends base_1.default {
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
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.memory.has(key)) {
                return 'key not found';
            }
            this.monitor.hit();
            return this.memory.get(key);
        });
    }
    put(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.default = NoEviction;
