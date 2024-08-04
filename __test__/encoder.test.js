const Compressor = require('../encoder/encoder');
const 
 
describe('Encoder Test Suite', () => {
        let encoder;
        beforeEach(() => {
            encoder = new Compressor();
        });
  
        test('ensure that encoding is happening ', () => {
            const data = "dummy data"
            expect(encoder.compress(data)).();
        });
        test('ensure that decoding is happening ', () => { 
            expect(store.monitor).toBeDefined();
        });




        

        
    });

    




