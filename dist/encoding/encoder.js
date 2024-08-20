"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    compress(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, lz4_napi_1.compress)(data);
        });
    }
    decompress(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, lz4_napi_1.uncompress)(data);
        });
    }
}
class compressorFactory {
    static create(method) {
        if (method === null || method === undefined) {
            return new Compressor();
        }
        method = method.toString().toLowerCase();
        switch (method) {
            case 'lz4':
                return new LZ4();
            case 'none':
                return new Compressor();
            default:
                throw new Error("Invalid compression type passed");
        }
    }
}
exports.compressorFactory = compressorFactory;
