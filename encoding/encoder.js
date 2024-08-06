const {compress , uncompress} = require('lz4-napi')
class Compressor {
    constructor() {}
    compress(data){ return data}
    decompress(data) {return data}
}
class LZ4 extends Compressor {
    constructor() {
        super()
    }
    async compress(data) {
        return await compress(data)
    }
    async decompress(data) {
        const originalData = await uncompress(data)
        return Buffer.from(originalData).toString()
    }
}
class compressorFactory {
    static create(method) {
        method = method.toString().toLowerCase()
        switch (method) {
            case 'lz4':
                return new LZ4()
            default:
                throw new Error("Invalid compression type passed")
        }
    }
}


module.exports = {Compressor : Compressor , compressorFactory : compressorFactory}