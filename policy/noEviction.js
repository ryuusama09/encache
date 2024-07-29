const policy = require('./base')
const sizeof = require('object-sizeof')

class NoEviction extends policy {
    constructor(memory, monitor) {
        super('NO_EVICTION')
        this.memory = memory
        this.monitor = monitor
    }
    safe(data) {
        return sizeof(data) + this.memory.current <= this.memory.maxmemory
    }
    async get(_key) {
        this.monitor.reference()
        if (!this.memory.has(_key)) { return "key not found" }
        this.monitor.hit()
        return this.memory.get(_key)
    }
    async put(_key, data) {
        let release = async () => { }
        try{
            if(this.memory.has(_key)){
                release = await this.memory.mutexPool.get(this.memory.getHash(_key)).acquire()
                this.memory.set(_key , data)
                return
            }
            if(!this.safe(data)){
                console.warn(`Cannot Insert ${_key}, Data size exceeds cache size`)
                return 
            }
            this.memory.set(_key , data)  
        }finally{
            release()
        }
    }
}
module.exports = NoEviction