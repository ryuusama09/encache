

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
    set(key, value) {
        const wasPresent = this.has(key);
        const hashValue = this.getHash(key);
        this.store[hashValue] = value;
        console.log(this.store[hashValue])
        this.current += wasPresent ? sizeof(value) : 0;
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
    remove(key) {
        const hashValue = this.getHash(key);
        const value = this.store[hashValue];
        this.store[hashValue] = null;
        this.current -= sizeof(value)
    }

}
module.exports = memory;



