"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Monitor {
    memory; // Assuming memory is an object with a 'current' property
    hits;
    references;
    evictions;
    accessTime;
    constructor(memory) {
        this.memory = memory;
        this.hits = 0;
        this.references = 0;
        this.evictions = 0;
        this.accessTime = 0;
    }
    hit() {
        this.hits++;
    }
    reference() {
        this.references++;
    }
    evict() {
        this.evictions++;
    }
    access(diff) {
        this.accessTime += diff;
    }
    hitRatio() {
        return ((1.0 * this.hits) / this.references).toFixed(3);
    }
    missRatio() {
        return (1 - Number(this.hitRatio())).toFixed(3);
    }
    memoryConsumption() {
        return this.memory.current;
    }
    // latency(): number {
    //   return ((1.0 * this.accessTime) / this.references);
    // }
    fillRate() {
        return ((1.0 * this.memory.current) / this.memory.maxmemory).toFixed(3);
    }
    evictionRate() {
        return ((1.0 * this.evictions) / this.references).toFixed(3);
    }
    show() {
        // Implement show logic here
    }
}
exports.default = Monitor;
