class policy {
    constructor(name) {
      this.name = name
    }
    type(){return this.name}
    get() { }
    put() { }
    safe(){ }
    evict(){ }
  }
  
module.exports = policy