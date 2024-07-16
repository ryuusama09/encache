
class encoder {
    constructor(){}
    encode(){}
    decode(){}
}
class encodeBase64 extends encoder{
    constructor(){
        super()
    }
    encode(data){
        return Buffer.from(data).toString('base64')
    }
    decode(data){
        return Buffer.from(data, 'base64').toString('utf-8')
    }
}
class encodeJSON extends encoder{
    constructor(){
        super()
    }
    encode(data){
        return JSON.stringify(data)
    }
    decode(data){
        return JSON.parse(data)
    }
}
class encodeHex extends encoder{
    constructor(){
        super()
    }
    encode(data){
        return Buffer.from(data).toString('hex')
    }
    decode(data){
        return Buffer.from(data, 'hex').toString('utf-8')
    }
}
class encodeUTF8 extends encoder{
    constructor(){
        super()
    }
    encode(data){
        return Buffer.from(data).toString('utf-8')
    }
    decode(data){
        return Buffer.from(data, 'utf-8').toString('utf-8')
    }
}
class encodeASCII extends encoder{
    constructor(){
        super()
    }
    encode(data){
        return Buffer.from(data).toString('ascii')
    }
    decode(data){
        return Buffer.from(data, 'ascii').toString('utf-8')
    }
}
class encodeString extends encoder{
    constructor(){
        super()
    }
    encode(data){
        return data
    }
    decode(data){
        return data
    }
}
class encoderFactory{
    static create(type){
        switch (type) {
            case 'base64':
              return new encodeBase64();
      
            case 'json':
              return new encodeJSON();
      
            case 'hex':
              return new encodeHex();

            case 'utf-8':
              return new encodeUTF8();

            case 'ascii':
              return new encodeASCII();

            default:
              {
                return new encodeString();
              }
    }
}
}

const encoderMap = {
    'base64': encodeBase64,
    'json': encodeJSON,
    'hex': encodeHex,
    'utf-8': encodeUTF8,
    'ascii': encodeASCII,
    'string': encodeString
    // Add more entries for other policy classes
  };
module.exports = {encoder , encoderFactory,  encoderMap};