const policy = require('./base')
class LFU extends policy{
    constructor(memory , monitor ){
        super('LFU')
        this.memory = memory
        this.monitor = monitor
        this.lfuMap = new Map()
        this.head = new Node("dummy" , "dummy")
        this.tail = new Node("dummy" , "dummy")
        this.head.next = this.tail
        this.tail.prev = this.head
    }
}
module.exports = LFU