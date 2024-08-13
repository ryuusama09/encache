import Policy from './base';
interface FIFOOptions {
    memory: any;
    monitor: any;
    logger: any;
}
declare class FIFO extends Policy {
    private queue;
    private memory;
    private monitor;
    private logger;
    private keyStore;
    constructor(options: FIFOOptions);
    safe(data: any): Boolean;
    keys(): string[];
    get(key: string): any | string;
    put(key: string, data: any): Promise<void>;
    evict(): Promise<void>;
}
export default FIFO;
