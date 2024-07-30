const sizeof = require('object-sizeof')
const policy = require('./base')



class FIFO extends policy {
  constructor(memory, monitor) {
    super('FIFO')
    this.queue = []
    this.memory = memory
    this.monitor = monitor
  }
  safe(data) {
    return sizeof(data) + this.memory.current <= this.memory.maxmemory
  }
  get(_key) {
    if(!this.memory.has(_key)){return "key not found"}
    this.monitor.hit()  
    return this.memory.get(_key)
  }
  async put(_key, data) {
    let release = async () => { }
    try {
      if (this.memory.has(_key)) {
        release = await this.memory.mutexPool.get(this.memory.getHash(_key)).acquire()
        this.memory.set(_key, data)
        return
      }
      try{
      while (!this.safe(data)) {
       // console.log("enter")
        if(this.memory.empty()){
          return "cache size is smaller than the data size"}
        await this.evict()
      }
    }
     finally{ 
      this.queue.push(_key)
      this.memory.set(_key, data)
     }

    } finally {
      release()
    }

  }
  async evict() {
    const key = this.queue[0]
    const release = await this.memory.mutexPool.get(this.memory.getHash(key)).acquire()
    try{
    this.queue.shift()
    this.memory.delete(key)
    this.monitor.evict()
    this.memory.mutexPool.delete(this.memory.getHash(key))
    }finally{
      release()
    }
  }
}
module.exports = FIFO
