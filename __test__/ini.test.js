const Cache = require('../index');
 
describe('Cache Initializ', () => {
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
        

        

        
    });

    




