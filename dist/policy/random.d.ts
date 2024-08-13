import Policy from './base';
interface RandomOptions {
    memory: any;
    monitor: any;
    logger: any;
}
declare class Random extends Policy {
    private memory;
    private monitor;
    private logger;
    constructor(options: RandomOptions);
    safe(data: any): boolean;
    get(key: string): Promise<string | any>;
    keys(): string[];
    put(key: string, data: any): Promise<void>;
    evict(): Promise<void>;
}
export default Random;
