import Policy from './base';
interface NoEvictionOptions {
    memory: any;
    monitor: any;
    logger: any;
}
declare class NoEviction extends Policy {
    private memory;
    private monitor;
    private logger;
    constructor(options: NoEvictionOptions);
    safe(data: any): boolean;
    keys(): string[];
    get(key: string): Promise<string | any>;
    put(key: string, data: any): Promise<void>;
}
export default NoEviction;
