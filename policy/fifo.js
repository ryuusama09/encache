const sizeof = require('object-sizeof')
const policy = require('./base')

class FIFO extends policy {
  constructor(memory, monitor, logger) {
    super('FIFO')
    this.queue = []
    this.memory = memory
    this.monitor = monitor
    this.logger = logger
    this.keyStore = new Map()
  }
  safe(data) {
    return sizeof(data) + this.memory.current <= this.memory.maxmemory
  }
  keys(){
     return Array.from(this.memory.store.keys())
  }
  get(_key) {
    if(!this.memory.has(_key)){return "key not found"}
    this.monitor.hit()  
    return this.memory.get(_key)
  }
  async put(_key, data) {
    try {
      if (this.memory.has(_key)) {
        this.memory.set(_key, data)
        return
      }
      try{
      while (!this.safe(data)) {
        if(this.memory.empty()){
          return "cache size is smaller than the data size"}
        await this.evict()
      }
    }
     finally{ 
      this.queue.push(_key)
      this.memory.set(_key, data)
     }

    } catch(err){
      this.logger.log(err , "error")
    }

  }
  async evict() {
    console.log("evict")
    const key = this.queue[0]
    try{
    this.queue.shift()
    this.memory.delete(key)
    this.monitor.evict()
    }catch(err){
      this.logger.log(err , "error")
    }
  }
}
module.exports = FIFO
