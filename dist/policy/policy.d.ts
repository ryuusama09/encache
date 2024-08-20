import Policy from './base';
interface PolicyFactoryOptions {
    memory: any;
    monitor: any;
    logger: any;
}
declare class PolicyFactory {
    static create(type: any, options: PolicyFactoryOptions): Policy;
}
export default PolicyFactory;
