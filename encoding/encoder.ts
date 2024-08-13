
import { compress, uncompress } from 'lz4-napi';

class Compressor {
  compress(data: any): any {
    return (data);
  }

  decompress(data: any): any {
    return (data);
  }
}

class LZ4 extends Compressor {
    async compress(data: any): Promise<any> {
      return compress(data);
    }
  
    async decompress(data: any): Promise<any> {
      return uncompress(data);
    }
  }
class compressorFactory {
    static create(method : String) {
        method = method.toString().toLowerCase()
        switch (method) {
            case 'lz4':
                return new LZ4()
            default:
                throw new Error("Invalid compression type passed")
        }
    }
}

export { Compressor, compressorFactory };