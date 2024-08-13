import Policy from './base';
interface LRUOptions {
    memory: any;
    monitor: any;
    logger: any;
}
declare class LRU extends Policy {
    private memory;
    private monitor;
    private logger;
    private lruMap;
    private head;
    private tail;
    constructor(options: LRUOptions);
    safe(data: any): boolean;
    keys(): string[];
    private add;
    private remove;
    get(key: string): Promise<string | any>;
    put(key: string, data: any): Promise<void>;
    evict(): Promise<void>;
}
export default LRU;
