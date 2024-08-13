import Policy from './base';
interface PolicyFactoryOptions {
    memory: any;
    monitor: any;
    logger: any;
}
declare class PolicyFactory {
    static create(type: string, options: PolicyFactoryOptions): Policy;
}
export default PolicyFactory;
