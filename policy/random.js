
const policy = require('./base')
const sizeof = require('object-sizeof')
const fnv = require('fnv-plus')

class Random extends policy{
    constructor(memory , monitor , logger){
        super('RANDOM')
        this.memory = memory
        this.monitor = monitor
        this.logger = logger
        this.keyStore = new Map()
    }
    safe(data){
        return sizeof(data) + this.memory.current <= this.memory.maxmemory
    }
    async get(_key){
        _key = fnv.fast1a64utf(_key)
        if(!this.memory.has(_key)){return "key not found"}
        this.monitor.hit()
        return this.memory.get(_key)
    }
    keys(){
        return this.keyStore.values()
    }
    async put(_key , data){
        const og = _key
        _key = fnv.fast1a64utf(_key)
        try{
            if(this.memory.has(_key)){
                this.memory.set(_key , data)
                return
            }
            while(!this.safe(data)){
                if(this.memory.empty()){
                    return "cache size is smaller than the data size"
                }
                await this.evict()
            }
        }catch(err){
            this.logger.log(err , "error")
        }
        finally{
            this.memory.set(_key , data)
            this.keyStore.set(_key , og)
        }
    }

    async evict(){
        let keyList = Array.from(this.memory.store.keys())
        console.log(keyList)
        const randomKey = keyList[Math.floor(Math.random() * keyList.length)]
        this.monitor.evict()
        this.memory.delete(randomKey)
        this.keyStore.delete(randomKey)   
    }
}

module.exports = Random