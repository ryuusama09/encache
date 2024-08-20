declare class Compressor {
    compress(data: any): any;
    decompress(data: any): any;
}
declare class LZ4 extends Compressor {
    compress(data: any): Promise<any>;
    decompress(data: any): Promise<any>;
}
declare class compressorFactory {
    static create(method: String): LZ4;
}
export { Compressor, compressorFactory };
