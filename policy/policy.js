
const sizeof = require('object-sizeof')
class policy {
  constructor() { }
  add() { }
  delete() { }
}

class FIFO extends policy {
  constructor(memory, monitor) {
    super()
    this.queue = []
    this.memory = memory
    this.monitor = monitor
  }
  safe(data) {
    return sizeof(data) + this.memory.current <= this.memory.maxmemory
  }
  get(key) {
    this.monitor.reference()
    const value = this.memory.get(key)
    return value;
  }
  async put(_key, data) {

    let release = async () => { }
    try {
      if (this.memory.has(_key)) {
        release = await this.memory.mutexPool.get(this.memory.getHash(_key)).acquire()
        this.memory.set(_key, data)
        return
      }

      while (!this.safe(data)) {
        this.evict()
      }
      this.queue.push(_key)
      this.memory.set(_key, data)

    } finally {
      release()
    }

  }
  async evict() {
    const key = this.queue.front()
    const release = await this.memory.mutexPool.get(key).acquire()
    this.queue.pop()
    this.memory.store.delete(key)
    this.memory.mutexPool.delete(key)
  }
}
class LRU extends policy {



}
class LFU extends policy {


}
class TTL extends policy {

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
