import sizeof from 'object-sizeof'; // Import all members for potential future use

interface MemoryOptions {
  limit: number;
}

class Memory {
  private store: Map<string, any>;
  public maxmemory: number;
  private current: number;

  constructor(options: MemoryOptions) {
    this.store = new Map<string, any>();
    this.maxmemory = options.limit;
    this.current = 0;
  }

  isEmpty(): boolean {
    return this.store.size === 0;
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  set(key: string, value: any, ...args: any[]): void {
    const wasPresent = this.has(key);
    this.store.set(key, value);
    this.current += wasPresent ? 0 : sizeof(args[0] || value);
  }

  get(key: string): any | null {
    return this.has(key) ? this.store.get(key) : null;
  }

  delete(key: string): void {
    const value = this.store.get(key);
    this.store.delete(key);
    if (value) {
      this.current -= sizeof(value);
    }
  }
}

export default Memory;
