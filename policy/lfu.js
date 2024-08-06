const policy = require('./base')
const Node = require('./dbl')
const sizeof = require('object-sizeof')

class LFU extends policy{
    constructor(memory , monitor ){
        super('LFU')
        this.memory = memory
        this.monitor = monitor
        this.lfuMap = new Map()
        this.head = new Node(0 , "dummy")
        this.tail = new Node(0 , "dummy")
        this.head.next = this.tail
        this.tail.prev = this.head
        this.address = new Map()
        this.lastInGroup = new Map()
        this.freq = new Map()
        this.groupMembersCount = new Map()
        this.keyStore = new Map()
    }
    safe(data) {
        return sizeof(data) + this.memory.current <= this.memory.maxmemory
    }
    keys(){
        return Array.from(this.memory.store.keys())
    }  
    async get(_key, toHit = true) {
        if(!this.memory.has(_key)){return "key not found"}
        if (toHit){
            this.monitor.hit()
        }
        
        const node = this.address.get(_key);
        this.cyclicallyRotateLeft(node, this.lastInGroup.get(this.freq.get(_key)));
        this.groupMembersCount.set(this.freq.get(_key), this.groupMembersCount.get(this.freq.get(_key)) - 1);
        if (this.groupMembersCount.get(this.freq.get(_key)) === 0) {
            this.groupMembersCount.delete(this.freq.get(_key));
            this.lastInGroup.delete(this.freq.get(_key));
        }
        this.freq.set(_key, this.freq.get(_key) + 1);
        this.groupMembersCount.set(this.freq.get(_key), (this.groupMembersCount.get(this.freq.get(_key)) || 0) + 1);
        if (this.groupMembersCount.get(this.freq.get(_key)) === 1) {
            this.lastInGroup.set(this.freq.get(_key), node);
        }

        if (this.groupMembersCount.has(this.freq.get(_key) - 1)) {
            this.lastInGroup.set(this.freq.get(_key) - 1, node.prev);
        }
        this.cyclicallyRotateLeft(node, this.lastInGroup.get(this.freq.get(_key)));
        this.lastInGroup.set(this.freq.get(_key), node);
        
        return this.memory.get(_key)

    }

    async put(key, value) {
        if (this.address.has(key)) {
            this.address.get(key).val = value;
            this.memory.set(key, value);
            this.get(key, false);
            return;
        }
        
        while(!this.safe(value)){
            if(this.memory.empty()){
                return "cache size is smaller than the data size"}
            await this.evict()
        }

        this.memory.set(key, value);
        let newLfu = new Node(key, value);
        let lfu = this.head.next;
        lfu.prev = newLfu;
        newLfu.next = lfu;
        this.head.next = newLfu;
        newLfu.prev = this.head;
        
        this.address.set(key, newLfu);
        this.freq.set(key, 1);
        this.groupMembersCount.set(1, (this.groupMembersCount.get(1) || 0) + 1);
        if (this.groupMembersCount.get(1) === 1) {
            this.lastInGroup.set(1, newLfu);
        }
        this.cyclicallyRotateLeft(newLfu, this.lastInGroup.get(1));
        this.lastInGroup.set(1, newLfu);
    }

    async evict() {
        let lfu = this.head.next;
        let newLfu = lfu.next;
        this.head.next = newLfu;
        newLfu.prev = this.head;

        this.address.delete(lfu.key);
        this.memory.delete(lfu.key);
        this.monitor.evict()
        
        this.groupMembersCount.set(this.freq.get(lfu.key), (this.groupMembersCount.get(this.freq.get(lfu.key)) || 0) - 1);
        this.freq.set(lfu.key, (this.freq.get(lfu.key) || 0) - 1);
        if (this.groupMembersCount.get(this.freq.get(lfu.key)) === 0) {
            this.groupMembersCount.delete(this.freq.get(lfu.key));
            this.lastInGroup.delete(this.freq.get(lfu.key));
        }
        if (this.freq.get(lfu.key) === 0) {
            this.freq.delete(lfu.key);
        }
    }
    
    cyclicallyRotateLeft(L, R) {
        if (L === R){ return; }
        const a = L.prev;
        const b = R.next;
        a.next = L.next;
        L.next.prev = a;
        L.next = b;
        b.prev = L;
        R.next = L;
        L.prev = R;
    }
}
module.exports = LFU