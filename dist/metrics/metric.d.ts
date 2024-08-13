declare class Monitor {
    private memory;
    private hits;
    private references;
    private evictions;
    private accessTime;
    constructor(memory: any);
    hit(): void;
    reference(): void;
    evict(): void;
    access(diff: number): void;
    hitRatio(): String;
    missRatio(): String;
    memoryConsumption(): Number;
    fillRate(): string;
    evictionRate(): string;
    show(): void;
}
export default Monitor;
