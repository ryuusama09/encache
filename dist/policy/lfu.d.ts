import Policy from './base';
import Node from './dbl';
interface LFUOptions {
    memory: any;
    monitor: any;
}
declare class LFU extends Policy {
    private memory;
    private monitor;
    private lfuMap;
    private head;
    private tail;
    private address;
    private lastInGroup;
    private freq;
    private groupMembersCount;
    private keyStore;
    constructor(options: LFUOptions);
    safe(data: any): boolean;
    keys(): string[];
    get(key: string, toHit?: boolean): Promise<any | string>;
    put(key: string, value: any): Promise<void>;
    evict(): Promise<void>;
    cyclicallyRotateLeft(L: Node<any> | any, R: Node<any> | any): void;
}
export default LFU;
