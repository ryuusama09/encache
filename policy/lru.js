const sizeof = require('object-sizeof')
const Node = require('./dbl')
const policy = require('./base')

class LRU extends policy {
    constructor(memory , monitor){
        super('LRU')
        this.memory = memory
        this.monitor = monitor
        this.lruMap = new Map()
        this.head = new Node("dummy" , "dummy" )
        this.tail = new Node("dummy" , "dummy")
        this.head.next = this.tail
        this.tail.prev = this.head
    }
    safe(data) {
        return sizeof(data) + this.memory.current <= this.memory.maxmemory
    }
    add(node){
        this.head.next.prev = node
        node.next = this.head.next
        node.prev = this.head 
        this.head.next = node
    }
    remove(node){
        node.prev.next = node.next
        node.next.prev = node.prev
        node = null
    }
    async get(_key){
        this.monitor.reference()
        if(!this.memory.has(_key)){return "key not found"}
        this.monitor.hit()
        const node = this.lruMap.get(_key)
        this.remove(node)
        const value = this.memory.get(_key)
        const newNode = new Node(_key , node.value)
        this.add(newNode)
        return value
    }

    async put(_key , data){
        let release = async () => {}
        try {
            if(this.memory.has(_key)){
                release = await this.memory.mutexPool.get(this.memory.getHash(_key)).acquire()
                const node = this.lruMap.get(_key)
                this.remove(node)
                const newNode = new Node(_key , data)
                this.add(newNode)
                this.lruMap.set(_key , newNode)
                this.memory.set(_key , data)
                return
            }
            try{
                while(!this.safe(data)){
                    if(this.memory.empty()){
                        return "cache size is smaller than the data size"}
                    await this.evict()
                }
            }
            finally{
                const node = new Node(_key , data)
                this.add(node)
                this.lruMap.set(_key , node)
                this.memory.set(_key , data)     
            }
        } finally {
            release()
        }
    }

    async evict(){

        const delNode = this.tail.prev
        const key = delNode.key
        const release = await this.memory.mutexPool.get(this.memory.getHash(key)).acquire()
        try{
        this.remove(delNode)
        this.memory.delete(key)
        this.lruMap.delete(key)
        this.memory.mutexPool.delete(this.memory.getHash(key))
        }finally{
            release()
        }
    }

}
module.exports = LRU  