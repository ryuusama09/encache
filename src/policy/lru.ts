import  Policy  from './base';
import  Node  from './dbl'; 
import sizeof from 'object-sizeof';

interface LRUOptions {
  memory: any; 
  monitor: any; 
  logger: any; 
}

class LRU extends Policy {
  private memory: any;
  private monitor: any;
  private logger: any;
  private lruMap: Map<string, Node<any>>;
  private head: Node<any>;
  private tail: Node<any>;

  constructor(options: LRUOptions) {
    super('LRU');
    this.memory = options.memory;
    this.monitor = options.monitor;
    this.logger = options.logger;
    this.lruMap = new Map();
    this.head = new Node('dummy', 'dummy');
    this.tail = new Node('dummy', 'dummy');
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  safe(data: any): boolean {
    return sizeof(data) + this.memory.current <= this.memory.maxmemory;
  }

  keys(): string[] {
    return Array.from(this.memory.store.keys());
  }

  private add(node: Node<any>): void {
    this.head.next!.prev = node;
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next = node;
  }

  private remove(node: Node<any>): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
    node.next = null;
    node.prev = null;
  }

  async get(key: string): Promise<string | any> {
    if (!this.memory.has(key)) {
      return 'key not found';
    }

    this.monitor.hit();
    const node = this.memory.get(key);
    const value = node.value;
    this.remove(node);
    const newNode = new Node(' ', value);
    this.add(newNode);
    return value;
  }

  async put(key: string, data: any): Promise<void> {
    try {
      if (this.memory.has(key)) {
        const node = this.memory.get(key);
        this.remove(node);
        const newNode = new Node(' ', data);
        this.add(newNode);
        this.memory.set(key, newNode, sizeof(data));
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
        const node = new Node(' ', data);
        this.add(node);
        this.memory.set(key, node, sizeof(data));
      }
    } catch (err) {
      this.logger.log(err, 'error');
    }
  }

  async evict(): Promise<void> {
    const delNode : Node<any> = this.tail.prev!;
    const key = delNode.key;
    try {
      this.remove(delNode);
      this.memory.delete(key);
      this.monitor.evict();
    } catch (err) {
      this.logger.log(err, 'error');
    }
  }
}

export default LRU;