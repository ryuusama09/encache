// library for cache-node .... 
// 

const policyFactory = require('./policy/policy') 
const memory = require('./memory/module')
const monitor = require('./metrics/metric')
const compressorFactory = require('./encoding/method')
class cache{
    constructor(size = 5000){
        this.memory = new memory(size)
        this.compressor = compressorFactory.create()
        this.monitor = new monitor(this.memory)
        this.policy = null
    }
    setCompression(method){
        this.encoder = compressorFactory.create(method)
    } 
    setPolicy(policy){
       this.policy = policyFactory.create(policy , this.memory , this.monitor)
    }
    setTTL(ttl){
        if(this.policy.type() !== 'TTL')throw new Error('policy not set to TTL')
        this.policy.validity = ttl
    }
    async put(key , data){
        if(this.policy === null) throw new Error('policy not set')
        data = await this.compressor.compress(data)
        await this.policy.put(key ,data)
    }    
    async get(key){
       if(this.policy === null) throw new Error('policy not set')
       let data = await this.policy.get(key)
       return await this.compressor.decompress(data)
    }
    hitRatio(){
        return this.monitor.hitRatio() 
    }
    missRatio(){
        return this.monitor.missRatio()
    }
    memoryConsumption(){
        return this.monitor.memoryConsumption()
    }



}
module.exports = cache

 
