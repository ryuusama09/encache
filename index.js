// library for cache-node .... 
// 
import { encoderFactory } from './encoding';

class CacheJs {

    constructor(size ){
        // intialize cache memory , slab allocat
        allocate(this.memory)
        this.encodingMethod = encodeBase64
    }
    setEncoding(method){
        this.encoder = encoderFactory.create(method)
    } 
    setPolicy(policy){
        if (policyList.find(policy) == -1){
            throw new Error("Invalid policy")
        }
        this.policy = policy
    }
    put(){}    
    get(){}
    // internal delete function to evict the cache 
}