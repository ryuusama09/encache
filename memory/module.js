

const fnv = require('fnv-plus');
const sizeof = require('object-sizeof');

class memory {
    constructor(limit) {
        this.store = new Map();
        this.maxmemory = parseInt(limit)
        this.current = 0
    }
    empty(){
        return this.store.size === 0
    }
    has(key) {
        return this.store.get(key) != null;
    }
    set(key, value) {
        const wasPresent = this.has(key);
        this.store.set(key , value)
        this.current += wasPresent ? 0 : sizeof(value);
    }
    get(key) {
        return this.has(key) ? this.store.get(key) : null;
    }

    delete(key) {
        const value = this.store.get(key);
        this.store.delete(key);
        this.current -= sizeof(value)
    }

}
module.exports = memory;



