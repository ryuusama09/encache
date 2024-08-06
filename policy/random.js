
const policy = require('./base')
const sizeof = require('object-sizeof')

class Random extends policy{
    constructor(memory , monitor , logger){
        super('RANDOM')
        this.memory = memory
        this.monitor = monitor
        this.logger = logger 
    }
    safe(data){
        return sizeof(data) + this.memory.current <= this.memory.maxmemory
    }
    async get(_key){
        if(!this.memory.has(_key)){return "key not found"}
        this.monitor.hit()
        return this.memory.get(_key)
    }
    keys(){
        return this.keyStore.values()
    }
    async put(_key , data){
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
        }
    }

    async evict(){
        let keyList = Array.from(this.memory.store.keys())
        console.log(keyList)
        const randomKey = keyList[Math.floor(Math.random() * keyList.length)]
        this.monitor.evict()
        this.memory.delete(randomKey)
    }
}

module.exports = Random