"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var base_1 = require("./base");
var dbl_1 = require("./dbl");
var object_sizeof_1 = require("object-sizeof");
var TTL = /** @class */ (function (_super) {
    __extends(TTL, _super);
    function TTL(options) {
        var _this = _super.call(this, 'TTL') || this;
        _this.memory = options.memory;
        _this.monitor = options.monitor;
        _this.logger = options.logger;
        _this.ttl = new Map();
        _this.head = new dbl_1.default('dummy', 'dummy', -10);
        _this.tail = new dbl_1.default('dummy', 'dummy', -10);
        _this.head.next = _this.tail;
        _this.tail.prev = _this.head;
        _this.validity = 3600 * 1000; // One hour in milliseconds
        return _this;
    }
    TTL.prototype.expired = function (_key) {
        var node = this.memory.get(_key);
        if (!node)
            return true; // Consider expired if key doesn't exist
        var makeTime = node.time;
        return makeTime + this.validity < Date.now();
    };
    TTL.prototype.safe = function (data) {
        return (0, object_sizeof_1.default)(data) + this.memory.current <= this.memory.maxmemory;
    };
    TTL.prototype.keys = function () {
        return Array.from(this.memory.store.keys());
    };
    TTL.prototype.setTTL = function (validity) {
        this.validity = validity;
    };
    TTL.prototype.get = function (_key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.memory.has(_key)) {
                    return [2 /*return*/, 'key not found'];
                }
                if (this.expired(_key)) {
                    this.evict(_key);
                    return [2 /*return*/, 'key not found'];
                }
                this.monitor.hit();
                return [2 /*return*/, this.memory.get(_key).time];
            });
        });
    };
    TTL.prototype.put = function (_key, data) {
        return __awaiter(this, void 0, void 0, function () {
            var newNode, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        if (this.memory.has(_key)) {
                            this.memory.get(_key).value = data;
                            this.memory.get(_key).time = Date.now();
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 5, 7]);
                        _a.label = 2;
                    case 2:
                        if (!!this.safe(data)) return [3 /*break*/, 4];
                        if (this.memory.empty()) {
                            throw new Error('cache size is smaller than the data size');
                        }
                        return [4 /*yield*/, this.evict()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        newNode = new dbl_1.default(' ', data, Date.now());
                        return [4 /*yield*/, this.add(newNode)];
                    case 6:
                        _a.sent();
                        console.time('set');
                        this.memory.set(_key, newNode, (0, object_sizeof_1.default)(data));
                        console.timeEnd('set');
                        return [7 /*endfinally*/];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_1 = _a.sent();
                        this.logger.log(err_1, 'error');
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    TTL.prototype.remove = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                node.prev.next = node.next;
                node.next.prev = node.prev;
                node = null;
                return [2 /*return*/];
            });
        });
    };
    TTL.prototype.add = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                node.prev = this.tail.prev;
                node.next = this.tail;
                this.tail.prev = node;
                node.prev.next = node;
                return [2 /*return*/];
            });
        });
    };
    TTL.prototype.evict = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var delNode, key, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delNode = this.memory.get(args[0]) || this.head.next;
                        key = delNode.key;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this.memory.delete(key);
                        return [4 /*yield*/, this.remove(delNode)];
                    case 2:
                        _a.sent();
                        this.monitor.evict();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        this.logger.log(err_2, 'error');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return TTL;
}(base_1.default));
exports.default = TTL;
