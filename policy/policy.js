
const FIFO = require('./fifo')
const LRU = require('./lru')
const LFU = require('./lfu')
const TTL = require('./ttl')
const Random = require('./random')
const NoEviction = require('./noEviction')  

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
      case 'RANDOM':
        return new Random(memory, monitor);
      case 'NO_EVICTION':
        return new NoEviction(memory, monitor);
      default:
        {
          throw new Error("invalid policy . Please choose from FIFO, LRU, LFU, TTL, RANDOM, NO_EVICTION")
        }
    }
  }
}

module.exports = PolicyFactory
