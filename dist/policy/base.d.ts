declare class Policy {
    private name;
    constructor(name: string);
    type(): string;
    get(...args: any[]): any;
    put(...args: any[]): any;
    safe(...args: any[]): any;
    evict(...args: any[]): void;
}
export default Policy;
