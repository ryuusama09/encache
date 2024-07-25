
const sizeof = require('object-sizeof')
const SortedSet = require('js-sorted-set') 
const Node = require('./dbl')
class policy {
  constructor(type) {
    this.type = type
  }
  type(){return this.type}
  get() { }
  put() { }
  safe(){ }
  evict(){ }
}



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
    this.monitor.reference()
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
      this.memory.current += sizeof(data)
     }

    } finally {
      release()
    }

  }
  async evict() {
    const key = this.queue[0]
    const value = this.memory.get(key)  
    const release = await this.memory.mutexPool.get(this.memory.getHash(key)).acquire()
    try{
    this.queue.shift()
    this.memory.delete(key)
    this.memory.mutexPool.delete(this.memory.getHash(key))
    this.memory.current -= sizeof(value)
    }finally{
      release()
    }
  }
}
// class LRU extends policy {



// }
// class LFU extends policy {


// }

// we need to evict 


class TTL extends policy {
  constructor(memory , monitor){
    super()
    this.memory = memory
    this.monitor = monitor
    this.ttl = new Map()
    this.head = new Node("dummy" , "dummy" , -10)
    this.tail = new Node("dummy" , "dummy", -10)
    this.head.next = this.tail
    this.tail.prev = this.head
    this.validity = 3600*1000
  }
  expired(_key){
    const makeTime = this.ttl.get(_key).time
    return makeTime + this.validity < Date.now()
  }
  safe(data) {
    return sizeof(data) + this.memory.current <= this.memory.maxmemory
  }

  async get(_key) {
    this.monitor.reference()
    if(!this.memory.has(_key)){return "key not found"}
    if(this.expired(_key)){
      this.evict(_key)
       return "key not found"
    }
    this.monitor.hit()
    return this.memory.get(_key)
  }
   
  async put(_key , data){
    let release = async () => {}
    try {
      if(this.memory.has(_key)){
        release = await this.memory.mutexPool.get(this.memory.getHash(_key)).acquire()
        this.memory.set(_key , data)
        this.ttl.get(_key).time =  Date.now() 
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
        const newNode = new Node(_key , data , Date.now())
        await this.add(newNode)
        this.memory.set(_key , data)
        this.ttl.set(_key , newNode)
        this.memory.current += sizeof(data)
      }
    }
    finally {
      release()
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
    const value = this.memory.get(key)
    const release = await this.memory.mutexPool.get(this.memory.getHash(key)).acquire()
    try{
      await this.remove(delNode)
      this.memory.delete(key)
      this.memory.mutexPool.delete(this.memory.getHash(key))
      this.memory.current -= sizeof(value)
    }finally{
      release()
    }

}

}

class PolicyFactory {
  static create(type, memory, monitor) {
    switch (type) {
      case 'FIFO':
        return new FIFO(memory, monitor);
      case 'LRU':
        return new LRU(memory, monitor);
      case 'LFU':
        return new LFU(memory, monitor);
      case 'TTL':
        return new TTL(memory, monitor);
      default:
        {
          return new FIFO();
        }
    }
  }
}

module.exports = PolicyFactory
