import  Policy  from './base';
import sizeof from 'object-sizeof'; 

interface RandomOptions {
  memory: any; // Assuming memory has required methods
  monitor: any; // Assuming monitor has required methods
  logger: any; // Assuming logger has required methods
}

class Random extends Policy {
  private memory: any;
  private monitor: any;
  private logger: any;

  constructor(options: RandomOptions) {
    super('RANDOM');
    this.memory = options.memory;
    this.monitor = options.monitor;
    this.logger = options.logger;
  }

  safe(data: any): boolean {
    return sizeof(data) + this.memory.current <= this.memory.maxmemory;
  }

  async get(key: string): Promise<string | any> {
    if (!this.memory.has(key)) {
      return 'key not found';
    }

    this.monitor.hit();
    return this.memory.get(key);
  }

  keys(): string[] {
    return Array.from(this.memory.store.keys());
  }

  async put(key: string, data: any): Promise<void> {
    try {
      if (this.memory.has(key)) {
        this.memory.set(key, data);
        return;
      }

      while (!this.safe(data)) {
        if (this.memory.empty()) {
          throw new Error('cache size is smaller than the data size');
        }
        await this.evict();
      }

      this.memory.set(key, data);
    } catch (err) {
      this.logger.log(err, 'error');
    } finally {
      // No action needed in the finally block as `memory.set` is already called conditionally.
    }
  }

  async evict(): Promise<void> {
    const keyList = Array.from(this.memory.store.keys());
    const randomKey = keyList[Math.floor(Math.random() * keyList.length)];
    this.monitor.evict();
    this.memory.delete(randomKey);
  }
}

export default Random;
