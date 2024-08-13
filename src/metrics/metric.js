"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Monitor = /** @class */ (function () {
    function Monitor(memory) {
        this.memory = memory;
        this.hits = 0;
        this.references = 0;
        this.evictions = 0;
        this.accessTime = 0;
    }
    Monitor.prototype.hit = function () {
        this.hits++;
    };
    Monitor.prototype.reference = function () {
        this.references++;
    };
    Monitor.prototype.evict = function () {
        this.evictions++;
    };
    Monitor.prototype.access = function (diff) {
        this.accessTime += diff;
    };
    Monitor.prototype.hitRatio = function () {
        return ((1.0 * this.hits) / this.references).toFixed(3);
    };
    Monitor.prototype.missRatio = function () {
        return (1 - Number(this.hitRatio())).toFixed(3);
    };
    Monitor.prototype.memoryConsumption = function () {
        return this.memory.current;
    };
    // latency(): number {
    //   return ((1.0 * this.accessTime) / this.references);
    // }
    Monitor.prototype.fillRate = function () {
        return ((1.0 * this.memory.current) / this.memory.maxmemory).toFixed(3);
    };
    Monitor.prototype.evictionRate = function () {
        return ((1.0 * this.evictions) / this.references).toFixed(3);
    };
    Monitor.prototype.show = function () {
        // Implement show logic here
    };
    return Monitor;
}());
exports.default = Monitor;
