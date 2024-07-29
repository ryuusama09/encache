const Cache = require('../index');
 
describe('Cache Initialization', () => {
        let store
        beforeEach(() => {
            store = new Cache();
        });

        test('import validation', () => {
            expect(store).toBeDefined();
        });
        test('initializing memory module for cache', () => {
            expect(store.memory).toBeDefined();
        });
        test('initializing monitor module for cache', () => {
            expect(store.monitor).toBeDefined();
        });
        test('initializing policy module for cache', () => {
            expect(store.policy).toBeNull();
        });
        test('initializing compressor module for cache', () => {
            expect(store.compressor).toBeDefined();
        });
        test('setting up the policy module', () => {
            store.setPolicy('FIFO');
            expect(store.policy.type()).toBe('FIFO');
        });
        test('ensure that ttl cannot be setup if policy is not TTL', () => {
            store.setPolicy('FIFO');
            expect(() => store.setTTL(1000)).toThrow('policy not set to TTL');
        });




        

        
    });

    




