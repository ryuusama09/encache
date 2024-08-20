import memory from './memory/module';
import monitor from './metrics/metric';
import Logger from './logger/logger';
interface CacheOptions {
    size?: number;
    compression?: string;
    policy?: string;
}
declare class Cache {
    size: number;
    memory: memory;
    private compressor;
    monitor: monitor;
    private policy;
    logger: Logger;
    constructor(options?: CacheOptions);
    safe(data: any): boolean;
    reset(): void;
    keys(): string[];
    setCompression(method: string): void;
    setPolicy(policy: any): void;
    setTTL(ttl: number): void;
    put(key: string, data: any): Promise<void>;
    get(key: string): Promise<any>;
    hitRatio(): any;
    missRatio(): any;
    memoryConsumption(): any;
    fillRate(): any;
    evictionRate(): any;
    show(): void;
}
export = Cache;
