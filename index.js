// This file is the entry point for the cache module.

const policyFactory = require('./policy/policy')
const memory = require('./memory/module')
const monitor = require('./metrics/metric')
const { compressorFactory, Compressor } = require('./encoding/encoder')
const Logger = require('./logs/logger')
const FIFO = require('./policy/fifo')
const sizeof = require('object-sizeof')
class cache {
    constructor(size = 5000) {
        this.memory = new memory(size)
        this.compressor = new Compressor()
        this.monitor = new monitor(this.memory)
        this.policy = new FIFO(this.memory, this.monitor)
        this.logger = new Logger({},this.monitor)
    }
    safe(data){
        return sizeof(data) <= this.memory.maxmemory
    }
    // reset(){
    //     delete this.memory
    //     this.memory = new memory(5000)
    //     delete this.monitor
    //     this.monitor = new monitor(this.memory)
    // }

    setCompression(method) {
        method = method.toString().toLowerCase()
        try {
            this.encoder = compressorFactory.create(method)
        } catch (e) {
           console.error(e)
        }
    }
    setPolicy(policy) {
        try{
            this.policy = policyFactory.create(policy, this.memory, this.monitor)
        } catch(e){
           // console.error(e)
           this.logger.log(e , "error")
        }   
    }
    setTTL(ttl) {
        try {
            if (this.policy.type() !== 'TTL') { throw new Error('policy not set to TTL') }
            this.policy.setTTL(ttl)
        } catch (err) {
            console.error(err)
        }

    }
    async put(key, data) {
        try{
        this.monitor.reference()
        if(!this.safe(data)){throw new Error("Data size exceeds cache size")}
        data = await this.compressor.compress(data)
        await this.policy.put(key, data)
        }catch(e){
            console.error(e)
        }
    }
    async get(key) {
        this.monitor.reference()
        let data = await this.policy.get(key)
        return await this.compressor.decompress(data)
    }
    hitRatio() {
        return this.monitor.hitRatio()
    }
    missRatio() {
        return this.monitor.missRatio()
    }
    memoryConsumption() {
        return this.monitor.memoryConsumption()
    }
    fillRate() {
        return this.monitor.fillRate()
    }
    evictionRate() {
        return this.monitor.evictionRate()
    }
    show() {
        this.logger.show()
    }



}
module.exports = cache


