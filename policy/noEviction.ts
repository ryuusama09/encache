import  Policy  from './base';
import sizeof from 'object-sizeof';

interface NoEvictionOptions {
  memory: any; // Assuming memory has required methods
  monitor: any; // Assuming monitor has required methods
  logger: any; // Assuming logger has required methods
}

class NoEviction extends Policy {
  private memory: any;
  private monitor: any;
  private logger: any;

  constructor(options: NoEvictionOptions) {
    super('NO_EVICTION');
    this.memory = options.memory;
    this.monitor = options.monitor;
    this.logger = options.logger;
  }

  safe(data: any): boolean {
    return sizeof(data) + this.memory.current <= this.memory.maxmemory;
  }

  keys(): string[] {
    return Array.from(this.memory.store.keys());
  }

  async get(key: string): Promise<string | any> {
    if (!this.memory.has(key)) {
      return 'key not found';
    }

    this.monitor.hit();
    return this.memory.get(key);
  }

  async put(key: string, data: any): Promise<void> {
    try {
      if (this.memory.has(key)) {
        this.memory.set(key, data);
        return;
      }

      if (!this.safe(data)) {
        this.logger.log(`Cannot Insert ${key}, Data size exceeds cache size`, 'warn');
        return;
      }

      this.memory.set(key, data);
    } catch (err) {
      this.logger.log(err, 'error');
    }
  }
}

export default NoEviction;
