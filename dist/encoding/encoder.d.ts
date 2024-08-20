declare class Compressor {
    compress(data: any): any;
    decompress(data: any): any;
}
declare class compressorFactory {
    static create(method: any): Compressor;
}
export { Compressor, compressorFactory };
