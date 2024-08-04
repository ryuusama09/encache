

const fnv = require('fnv-plus');
const sizeof = require('object-sizeof');
const Mutex = require('async-mutex').Mutex

class memory {
    constructor(limit) {
        this.store = [];
        this.maxmemory = parseInt(limit)
        this.current = 0
        this.mutexPool = new Map()
    }
    getHash(value) {
        return fnv.fast1a64utf(value.toString());
    }
    keys(){
        return Object.keys(this.store)
    }
    empty(){
        return  Object.keys(this.store).length === 0
    }
    set(key, value) {
        const wasPresent = this.has(key);
        const hashValue = this.getHash(key);
        this.store[hashValue] = value;
        this.current += wasPresent ? 0 : sizeof(value);
        if (!wasPresent) { this.mutexPool.set(this.getHash(key), new Mutex()) }
    }
    get(key) {
        const hashValue = this.getHash(key);
        return this.has(key) ? this.store[hashValue] : null;
    }
    has(key) {
        const hashValue = this.getHash(key);
        return this.store[hashValue] != null;
    }
    delete(key) {
        const hashValue = this.getHash(key);
        const value = this.store[hashValue];
        delete this.store[hashValue] ;
        this.current -= sizeof(value)
    }

}
module.exports = memory;



