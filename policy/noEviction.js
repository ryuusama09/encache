const policy = require('./base')
const sizeof = require('object-sizeof')


class NoEviction extends policy {
    constructor(memory, monitor,logger) {
        super('NO_EVICTION')
        this.memory = memory
        this.monitor = monitor
        this.logger = logger
    }
    safe(data) {
        return sizeof(data) + this.memory.current <= this.memory.maxmemory
    }
    keys(){
        return this.memory.store.keys()
    }
    async get(_key) {  
        if (!this.memory.has(_key)) { return "key not found" }
        this.monitor.hit()
        return this.memory.get(_key)
    }
    async put(_key, data) {
        
        try{
            if(this.memory.has(_key)){
                this.memory.set(_key , data)
                return
            }
            if(!this.safe(data)){
                this.logger.log(`Cannot Insert ${_key}, Data size exceeds cache size` , "warn")
                return 
            }
            this.memory.set(_key , data)  
            return 
        }catch(err){
            this.logger.log(err , "error")  
        }
       
    }
}
module.exports = NoEviction