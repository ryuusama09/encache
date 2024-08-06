
class monitor {

    constructor(memory) {
        this.memory = memory
        this.hits = parseInt(0);
        this.references =  parseInt(0);
        this.evictions =  parseInt(0);
        this.access_time =  parseInt(0);
    }
    hit() {
        this.hits++
    }
    reference() {
        this.references++
    }
    evict() {
        this.evictions++
    }
    access(diff){
        this.access_time += diff;
    }
    hitRatio() {
        return ((1.0 * this.hits )/ this.references).toFixed(3)
    }
    missRatio() {
        return (1 - this.hitRatio()).toFixed(3)
    }
    memoryConsumption() {
        return this.memory.current
    }
    // latency() {
    //     return ((1.0 * this.access_time)/this.references)
    // }
    fillRate() {
        return ((1.0 * this.memory.current )/ this.memory.maxmemory).toFixed(3)
    }
    evictionRate() {
        return ((1.0 * this.evictions) / this.references).toFixed(3)
    }
    



}
module.exports = monitor
