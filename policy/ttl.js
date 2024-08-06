const sizeof = require('object-sizeof')
const Node = require('./dbl')
const policy = require('./base')



class TTL extends policy {
  constructor(memory , monitor, logger){
    super('TTL')
    this.memory = memory
    this.monitor = monitor
    this.logger = logger
    this.ttl = new Map()
    this.head = new Node("dummy" , "dummy" , -10)
    this.tail = new Node("dummy" , "dummy", -10)
    this.head.next = this.tail
    this.tail.prev = this.head
    this.validity = 3600*1000
  }
  expired(_key){
    const node = this.memory.get(_key)
    const makeTime = node.time
    return makeTime + this.validity < Date.now()
  }
  safe(data) {
    return sizeof(data) + this.memory.current <= this.memory.maxmemory
  }
  keys(){
    return Array.from(this.memory.store.keys())
  }
  async get(_key) {
    if(!this.memory.has(_key)){return "key not found"}
    if(this.expired(_key)){
      this.evict(_key)
       return "key not found"
    }
    this.monitor.hit()
    return this.memory.get(_key).time
  }
   
  async put(_key , data){
    try {
      if(this.memory.has(_key)){
        this.memory.get(_key).value = data
        this.memory.get(_key).time = Date.now()
        return
      }
      try{
        while(!this.safe(data)){
          if(this.memory.empty()){
            return "cache size is smaller than the data size"
          }
          await this.evict()
        }
      }finally{
        
        const newNode = new Node(" " , data , Date.now())
        await this.add(newNode)
        console.time("set")
        this.memory.set(_key , newNode , sizeof(data))
        console.timeEnd("set")
      }
    }catch(err){
      this.logger.log(err , "error")
    }
   
  }

  async remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    node = null
  }

  async add(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev = node
    node.prev.next = node
  }

  async evict(){
    const delNode = this.head.next
    const key = delNode.key
    try{
      this.memory.delete(key)
      await this.remove(delNode)
      this.monitor.evict()
    }catch(err){
      this.logger.log(err , "error")
    }

}

}
module.exports = TTL