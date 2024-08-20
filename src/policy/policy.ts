import FIFO from './fifo';
import LRU from './lru';
import LFU from './lfu';
import TTL from './ttl';
import Random from './random';
import NoEviction from './noEviction';
import Policy from './base';

interface PolicyFactoryOptions {
  memory: any;
  monitor: any;
  logger: any;
}

class PolicyFactory {
  static create(type: string, options: PolicyFactoryOptions): Policy {
    switch (type ) {
      case 'FIFO':
        return new FIFO(options);
      case 'LRU':
        return new LRU(options);
      case 'LFU':
        return new LFU(options);
      case 'TTL':
        return new TTL(options);
      case 'RANDOM':
        return new Random(options);
      case 'NO_EVICTION':
        return new NoEviction(options);
      case undefined || '' || null :
        return new FIFO(options);
      default:
        throw new Error('Invalid policy. Please choose from FIFO, LRU, LFU, TTL, RANDOM, NO_EVICTION');
    }
  }
}

export default PolicyFactory;
