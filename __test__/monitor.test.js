const monitor = require('../metrics/metric')

describe('Monitor Initialization', () => {
        let mockObject;
        beforeEach(() => {
            mockObject = new monitor();
        });

        test('import validation', () => {
            expect(mockObject).toBeDefined();
            expect(mockObject.hits).toBe(0);
            expect(mockObject.references).toBe(0);
        });
        test('hits function should increment hits ', () => {
            const value = mockObject.hits;
            mockObject.hit();
            expect(mockObject.hits).toBe(value + 1);
        });
        test('reference function should increment references ', () => {
            const value = mockObject.references;
            mockObject.reference();
            expect(mockObject.references).toBe(value + 1);
        });
        test('hitRatio function should return hits/references ', () => {
            mockObject.hits = 10;
            mockObject.references = 20;
            expect(mockObject.hitRatio()).toBe(0.5.toFixed(3));
        });
        test('missRatio function should return 1 - hitRatio ', () => {
            mockObject.hits = 8;
            mockObject.references = 20;
            expect(mockObject.missRatio()).toBe(1 - mockObject.hitRatio());
        });
        test('testing fillRate for correctness', () => {
            mockObject.memory = {current: 10, maxmemory: 20};
            expect(mockObject.fillRate()).toBe((10/20).toFixed(3));
        });
        test('testing evictionRate for correctness', () => {
            mockObject.evictions = 8;
            mockObject.references = 20;
            expect(mockObject.evictionRate()).toBe((8/20).toFixed(3));
        });

        
        



        

        
    });

    




