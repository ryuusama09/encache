const {Compressor , compressorFactory} = require('../encoding/encoder');

 
describe('Encoder Test Suite', () => {
        let encoder;
        beforeEach(() => {
            encoder = compressorFactory.create('LZ4');
        });
  
        test('ensure that encoding is happening ', () => {
            const data = "dummy data"
            expect(encoder.compress(data)).not.toBe(data);
        });
        



        

        
    });

    




