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
    async decode(data) {
        const originalData = await uncompress(data)
        return Buffer.from(originalData).toString()
    }
}
class compressorFactory {
    static create(method) {
        switch (method) {
            case 'lz4':
                return new LZ4()
            default:
                return new Compressor()
        }
    }
}


module.exports = compressorFactory