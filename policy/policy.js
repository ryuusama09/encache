
const FIFO = require('./fifo')
const LRU = require('./lru')
const LFU = require('./lfu')
const TTL = require('./ttl')  

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
