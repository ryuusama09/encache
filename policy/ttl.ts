import  Policy  from './base';
import  Node  from './dbl';
import sizeof from 'object-sizeof';

interface TTLOptions {
  memory: any; // Assuming memory has required methods
  monitor: any; // Assuming monitor has required methods
  logger: any; // Assuming logger has required methods
}

class TTL extends Policy {
  private memory: any;
  private monitor: any;
  private logger: any;
  private ttl: Map<string, number>;
  private head: Node<any>;
  private tail: Node<any>;
  private validity: number;

  constructor(options: TTLOptions) {
    super('TTL');
    this.memory = options.memory;
    this.monitor = options.monitor;
    this.logger = options.logger;
    this.ttl = new Map();
    this.head = new Node('dummy', 'dummy', -10);
    this.tail = new Node('dummy', 'dummy', -10);
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.validity = 3600 * 1000; // One hour in milliseconds
  }

  private expired(_key: string): boolean {
    const node = this.memory.get(_key);
    if (!node) return true; // Consider expired if key doesn't exist
    const makeTime = node.time;
    return makeTime + this.validity < Date.now();
  }

  safe(data: any): boolean {
    return sizeof(data) + this.memory.current <= this.memory.maxmemory;
  }

  keys(): string[] {
    return Array.from(this.memory.store.keys());
  }

  setTTL(validity: number): void {
    this.validity = validity;
  }

  async get(_key: any): Promise<any> {
    if (!this.memory.has(_key)) {
      return 'key not found';
    }

    if (this.expired(_key)) {
      this.evict(_key);
      return 'key not found';
    }

    this.monitor.hit();
    return this.memory.get(_key).time;
  }

  async put(_key: string, data: any): Promise<void> {
    try {
      if (this.memory.has(_key)) {
        this.memory.get(_key).value = data;
        this.memory.get(_key).time = Date.now();
        return;
      }

      try {
        while (!this.safe(data)) {
          if (this.memory.empty()) {
            throw new Error('cache size is smaller than the data size');
          }
          await this.evict();
        }
      } finally {
        const newNode = new Node(' ', data, Date.now());
        await this.add(newNode);
        console.time('set');
        this.memory.set(_key, newNode, sizeof(data));
        console.timeEnd('set');
      }
    } catch (err) {
      this.logger.log(err, 'error');
    }
  }

  private async remove(node: Node<any>): Promise<void> {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
    node = null;
  }

  private async add(node: Node<any>): Promise<void> {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev = node;
    node.prev!.next = node;
  }

  async evict(...args : any[]): Promise<void> {
    const delNode = this.memory.get(args[0]) || this.head.next;
    const key = delNode.key;
    try {
      this.memory.delete(key);
      await this.remove(delNode);
      this.monitor.evict();
    } catch (err) {
      this.logger.log(err, 'error');
    }
  }
}

export default TTL;
