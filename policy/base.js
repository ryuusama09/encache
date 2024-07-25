class policy {
    constructor(type) {
      this.type = type
    }
    type(){return this.type}
    get() { }
    put() { }
    safe(){ }
    evict(){ }
  }
  
module.exports = policy