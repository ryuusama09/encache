
const policy = require('./base')
const sizeof = require('object-sizeof')

class Random extends policy{
    constructor(memory , monitor){
        super('Random')
        this.memory = memory
        this.monitor = monitor
        this.keys = new Map()
    }
    safe(data){
        return sizeof(data) + this.memory.current <= this.memory.maxmemory
    }
    async get(_key){
        this.monitor.reference()
        if(!this.memory.has(_key)){return "key not found"}
        this.monitor.hit()
        return this.memory.get(_key)
    }

    async put(_key , data){
        if(this.memory.has(_key)){
            const release = await this.memory.mutexPool.get(this.memory.getHash(_key)).acquire()
            this.memory.set(_key , data)
            release()
            return
        }

        try{
            while(!this.safe(data)){
                if(this.memory.empty()){
                    return "cache size is smaller than the data size"
                }
                await this.evict()
            }
        }
        finally{
            this.memory.set(_key , data)
            this.keys.set(this.memory.getHash(_key) , _key)
        }
    }
    async evict(){
        let keyList = Object.keys(this.memory.store)
        const randomKey = keyList[Math.floor(Math.random() * keyList.length)]
        const key = this.keys.get(randomKey)
        this.memory.delete(key)
        this.memory.mutexPool.delete(randomKey)
    }
}

module.exports = Random