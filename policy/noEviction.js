const policy = require('./base')
const sizeof = require('object-sizeof')
const fnv = require('fnv-plus')

class NoEviction extends policy {
    constructor(memory, monitor,logger) {
        super('NO_EVICTION')
        this.memory = memory
        this.monitor = monitor
        this.logger = logger
        this.keyStore = new Map()   
    }
    safe(data) {
        return sizeof(data) + this.memory.current <= this.memory.maxmemory
    }
    keys(){
        return this.keyStore.values()
    }
    async get(_key) {
        _key = fnv.fast1a64utf(_key)
        if (!this.memory.has(_key)) { return "key not found" }
        this.monitor.hit()
        return this.memory.get(_key)
    }
    async put(_key, data) {
        const og = _key
        _key = fnv.fast1a64utf(_key) 
        try{
            if(this.memory.has(_key)){
                this.memory.set(_key , data)
                return
            }
            if(!this.safe(data)){
                this.logger.log(`Cannot Insert ${og}, Data size exceeds cache size` , "warn")
                return 
            }
            this.memory.set(_key , data) 
            this.keyStore.set(_key , og) 
        }catch(err){
            this.logger.log(err , "error")  
        }
    }
}
module.exports = NoEviction