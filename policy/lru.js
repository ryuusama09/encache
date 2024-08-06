const sizeof = require('object-sizeof')
const Node = require('./dbl')
const policy = require('./base')

class LRU extends policy {
    constructor(memory , monitor , logger){
        super('LRU')
        this.memory = memory
        this.monitor = monitor
        this.lruMap = new Map()
        this.head = new Node("dummy" , "dummy" )
        this.tail = new Node("dummy" , "dummy")
        this.head.next = this.tail
        this.tail.prev = this.head
        this.logger = logger
    }
    safe(data) {
        return sizeof(data) + this.memory.current <= this.memory.maxmemory
    }
    keys(){
        return this.keyStore.values()
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
        if(!this.memory.has(_key)){return "key not found"}
        this.monitor.hit()
        const node = this.memory.get(_key)
        const value = node.value
        this.remove(node)
        const newNode = new Node(" " , value)
        this.add(newNode)
        return value
    }

    async put(_key , data){
        try {
            if(this.memory.has(_key)){
                const node = this.memory.get(_key)
                this.remove(node)
                const newNode = new Node(" ", data)
                this.add(newNode)
                this.memory.set(_key , newNode , sizeof(data))
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
                const node = new Node(" " , data)
                this.add(node)
                this.memory.set(_key , node , sizeof(data))
            }
        } catch(err){
            this.logger.log(err , "error")
        }
    }

    async evict(){

        const delNode = this.tail.prev
        const key = delNode.key
        try{
        this.remove(delNode)
        this.memory.delete(key)
        this.monitor.evict()
        }catch(err){
            this.logger.log(err , "error")
        }
    }

}
module.exports = LRU  