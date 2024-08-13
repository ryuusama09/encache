import Policy from './base';
interface TTLOptions {
    memory: any;
    monitor: any;
    logger: any;
}
declare class TTL extends Policy {
    private memory;
    private monitor;
    private logger;
    private ttl;
    private head;
    private tail;
    private validity;
    constructor(options: TTLOptions);
    private expired;
    safe(data: any): boolean;
    keys(): string[];
    setTTL(validity: number): void;
    get(_key: any): Promise<any>;
    put(_key: string, data: any): Promise<void>;
    private remove;
    private add;
    evict(...args: any[]): Promise<void>;
}
export default TTL;
