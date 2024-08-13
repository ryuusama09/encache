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
var LFU = /** @class */ (function (_super) {
    __extends(LFU, _super);
    function LFU(options) {
        var _this = _super.call(this, 'LFU') || this;
        _this.memory = options.memory;
        _this.monitor = options.monitor;
        _this.lfuMap = new Map();
        _this.head = new dbl_1.default(0, 'dummy');
        _this.tail = new dbl_1.default(0, 'dummy');
        _this.head.next = _this.tail;
        _this.tail.prev = _this.head;
        _this.address = new Map();
        _this.lastInGroup = new Map();
        _this.freq = new Map();
        _this.groupMembersCount = new Map();
        _this.keyStore = new Map();
        return _this;
    }
    LFU.prototype.safe = function (data) {
        return (0, object_sizeof_1.default)(data) + this.memory.current <= this.memory.maxmemory;
    };
    LFU.prototype.keys = function () {
        return Array.from(this.memory.store.keys());
    };
    LFU.prototype.get = function (key_1) {
        return __awaiter(this, arguments, void 0, function (key, toHit) {
            var node;
            if (toHit === void 0) { toHit = true; }
            return __generator(this, function (_a) {
                if (!this.memory.has(key)) {
                    return [2 /*return*/, 'key not found'];
                }
                if (toHit) {
                    this.monitor.hit();
                }
                node = this.address.get(key);
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
                return [2 /*return*/, this.memory.get(key)];
            });
        });
    };
    LFU.prototype.put = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var newLfu, lfu;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.address.has(key)) {
                            this.address.get(key).value = value;
                            this.memory.set(key, value);
                            this.get(key, false);
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        if (!!this.safe(value)) return [3 /*break*/, 3];
                        if (this.memory.empty()) {
                            throw new Error('cache size is smaller than the data size');
                        }
                        return [4 /*yield*/, this.evict()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        this.memory.set(key, value);
                        newLfu = new dbl_1.default(key, value);
                        lfu = this.head.next;
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
                        return [2 /*return*/];
                }
            });
        });
    };
    LFU.prototype.evict = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lfu, newLfu;
            return __generator(this, function (_a) {
                lfu = this.head.next;
                newLfu = lfu.next;
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
                return [2 /*return*/];
            });
        });
    };
    LFU.prototype.cyclicallyRotateLeft = function (L, R) {
        if (L === R) {
            return;
        }
        var a = L.prev;
        var b = R.next;
        a.next = L.next;
        L.next.prev = a;
        L.next = b;
        b.prev = L;
        R.next = L;
        L.prev = R;
    };
    return LFU;
}(base_1.default));
exports.default = LFU;
