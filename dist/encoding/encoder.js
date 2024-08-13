"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressorFactory = exports.Compressor = void 0;
const lz4_napi_1 = require("lz4-napi");
class Compressor {
    compress(data) {
        return (data);
    }
    decompress(data) {
        return (data);
    }
}
exports.Compressor = Compressor;
class LZ4 extends Compressor {
    async compress(data) {
        return (0, lz4_napi_1.compress)(data);
    }
    async decompress(data) {
        return (0, lz4_napi_1.uncompress)(data);
    }
}
class compressorFactory {
    static create(method) {
        method = method.toString().toLowerCase();
        switch (method) {
            case 'lz4':
                return new LZ4();
            default:
                throw new Error("Invalid compression type passed");
        }
    }
}
exports.compressorFactory = compressorFactory;
