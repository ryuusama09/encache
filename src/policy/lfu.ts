import  Policy  from './base';
import  Node  from './dbl';
import sizeof from 'object-sizeof';

interface LFUOptions {
  memory: any;
  monitor: any;
}

class LFU extends Policy {
  private memory: any;
  private monitor: any;
  private lfuMap: Map<string, any>;
  private head: Node<any>;
  private tail: Node<any>;
  private address: Map<string, Node<any>>;
  private lastInGroup: Map<number, Node<any>>;
  private freq: Map<string, number>;
  private groupMembersCount: Map<number, number>;
  private keyStore: Map<string, any>;

  constructor(options: LFUOptions) {
    super('LFU');
    this.memory = options.memory;
    this.monitor = options.monitor;
    this.lfuMap = new Map();
    this.head = new Node(0, 'dummy');
    this.tail = new Node(0, 'dummy');
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.address = new Map();
    this.lastInGroup = new Map();
    this.freq = new Map<any , any>();
    this.groupMembersCount = new Map();
    this.keyStore = new Map();
  }

  safe(data: any): boolean {
    return sizeof(data) + this.memory.current <= this.memory.maxmemory;
  }

  keys(): string[] {
    return Array.from(this.memory.store.keys());
  }

  async get(key: string, toHit = true): Promise<any | string> {
    if (!this.memory.has(key)) {
      return 'key not found';
    }

    if (toHit) {
      this.monitor.hit();
    }

    const node = this.address.get(key);
    this.cyclicallyRotateLeft(node, this.lastInGroup.get(this.freq.get(key)!));
    this.groupMembersCount.set(this.freq.get(key)!, this.groupMembersCount.get(this.freq.get(key)!)! - 1);
    if (this.groupMembersCount.get(this.freq.get(key)!) === 0) {
      this.groupMembersCount.delete(this.freq.get(key)!);
      this.lastInGroup.delete(this.freq.get(key)!);
    }

    this.freq.set(key, this.freq.get(key)! + 1);
    this.groupMembersCount.set(this.freq.get(key)!, (this.groupMembersCount.get(this.freq.get(key)!) || 0) + 1);
    if (this.groupMembersCount.get(this.freq.get(key)!) === 1) {
      this.lastInGroup.set(this.freq.get(key)!, node!);
    }

    if (this.groupMembersCount.has(this.freq.get(key)! - 1)) {
      this.lastInGroup.set(this.freq.get(key)! - 1, node!.prev!);
    }
    this.cyclicallyRotateLeft(node, this.lastInGroup.get(this.freq.get(key)!));
    this.lastInGroup.set(this.freq.get(key)!, node!);

    return this.memory.get(key);
  }

  async put(key: string, value: any): Promise<void> {
    if (this.address.has(key)) {
      this.address.get(key)!.value = value;
      this.memory.set(key, value);
      this.get(key, false);
      return;
    }

    while (!this.safe(value)) {
      if (this.memory.empty()) {
        throw new Error('cache size is smaller than the data size');
      }
      await this.evict();
    }

    this.memory.set(key, value);
    let newLfu = new Node(key, value);
    let lfu : Node<any>= this.head.next!;
    lfu.prev = newLfu;
    newLfu.next = lfu;
    this.head.next = newLfu;
    newLfu.prev = this.head;

    this.address.set(key, newLfu);
    this.freq.set(key, 1);
    this.groupMembersCount.set(1, (this.groupMembersCount.get(1) || 0) + 1);
    if (this.groupMembersCount.get(1) === 1) {
      this.lastInGroup.set(1, newLfu);
    }
    this.cyclicallyRotateLeft(newLfu, this.lastInGroup.get(1));
    this.lastInGroup.set(1, newLfu);
  }

  async evict(): Promise<void> {
    let lfu = this.head.next;
    let newLfu = lfu.next;
    this.head.next = newLfu;
    newLfu.prev = this.head;

    this.address.delete(lfu.key);
    this.memory.delete(lfu.key);
    this.monitor.evict();

    this.groupMembersCount.set(this.freq.get(lfu.key)!, (this.groupMembersCount.get(lfu.key)!) - 1);
    this.freq.set(lfu.key, (this.freq.get(lfu.key)!) - 1);
    if (this.groupMembersCount.get(this.freq.get(lfu.key)!) === 0) {
      this.groupMembersCount.delete(this.freq.get(lfu.key)!);
      this.lastInGroup.delete(this.freq.get(lfu.key)!);
    }
    if (this.freq.get(lfu.key) === 0) {
      this.freq.delete(lfu.key);
    }
  }

  cyclicallyRotateLeft(L: Node<any> | any , R: Node<any> | any ): void {
    if (L === R) {
      return;
    }
    const a : any = L.prev;
    const b : any = R.next;
    a.next = L.next;
    L!.next.prev = a
    L.next = b;
    b.prev = L;
    R.next = L;
    L.prev = R;
  }
}

export default LFU;
