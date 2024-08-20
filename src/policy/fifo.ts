import  Policy from './base'; // Assuming base.ts defines Policy
import sizeof from 'object-sizeof';

interface FIFOOptions {
  memory: any; 
  monitor: any; 
  logger: any; 
}

class FIFO extends Policy {
  private queue: string[];
  private memory: any;
  private monitor: any;
  private logger: any;
  private keyStore: Map<string, any>;

  constructor(options: FIFOOptions) {
    super('FIFO');
    this.queue = [];
    this.memory = options.memory;
    this.monitor = options.monitor;
    this.logger = options.logger;
    this.keyStore = new Map<string, any>();
  }

  safe(data: any): Boolean {
    return sizeof(data) + this.memory.current <= this.memory.maxmemory;
  }

  keys(): string[] {
    return Array.from(this.memory.store.keys());
  }

  get(key: string): any | string {
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

      while (!this.safe(data)) {
        if (this.memory.isEmpty()) {
          throw new Error('cache size is smaller than the data size');
        }
        await this.evict();
      }

      this.queue.push(key);
      this.memory.set(key, data);
    } catch (err) {
      this.logger.log(err, 'error');
    } finally {
      // No need for actions in a finally block here
    }
  }

  async evict(): Promise<void> {
    const key = this.queue.shift();
    if (!key) {
      return; // Nothing to evict
    }

    try {
      this.memory.delete(key);
      this.monitor.evict();
    } catch (err) {
      this.logger.log(err, 'error');
    }
  }
}

export default FIFO;