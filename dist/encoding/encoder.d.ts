declare class Compressor {
    compress(data: any): any;
    decompress(data: any): any;
}
declare class compressorFactory {
    static create(method: String): Compressor;
}
export { Compressor, compressorFactory };
