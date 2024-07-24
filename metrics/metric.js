const sizeof = require('object-sizeof')
class monitor {

    constructor(memory) {
        this.memory = memory
        this.hits = 0;
        this.references = 0;
    }
    hit() {
        this.hits++
    }
    reference() {
        this.references++
    }
    hitRatio() {
        return (1.0 * this.hits / this.references)
    }
    missRatio() {
        return 1 - this.hitRatio()
    }
    memoryConsumption() {
        return this.memory.current
    }
    Latency(time) {
        // to be implemented 
    }

}
module.exports = monitor
