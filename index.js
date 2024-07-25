// library for cache-node .... 
// 
const encoderFactory = require('./encoding/method');
const policyFactory = require('./policy/policy') 
const memory = require('./memory/module')
const monitor = require('./metrics/metric')

class cache{
    
    constructor(size){
        this.memory = new memory(size)
        this.encodingMethod = encoderFactory.create()
        this.monitor = new monitor(this.memory)
    }
    setEncoding(method){
        this.encoder = encoderFactory.create(method)
    } 
    setPolicy(policy){
       this.policy = policyFactory.create(policy , this.memory , this.monitor)
    }
    setTTl(ttl){
        if(this.policy.type() !== 'TTL')throw new Error('policy not set to TTL')
        this.policy.validity = ttl
    }
    async put(key , data){
        await this.policy.put(key ,data)
    }    
    async get(key){
       return await this.policy.get(key)
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

 
