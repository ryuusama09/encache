interface MemoryOptions {
    limit: number;
}
declare class Memory {
    private store;
    maxmemory: number;
    private current;
    constructor(options: MemoryOptions);
    empty(): boolean;
    has(key: string): boolean;
    set(key: string, value: any, ...args: any[]): void;
    get(key: string): any | null;
    delete(key: string): void;
}
export default Memory;
