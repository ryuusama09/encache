class policy {
    constructor(){}
    add(){}
    delete(){}
}
class FIFO extends policy{
    constructor(limit){
        super()
        this.queue = []
        this.limit = limit
    }
    add(cache , data){
       if(cache.memory === limit){
            
       }
    }
    delete(){
        
    }
}
class PolicyFactory{
    static create(type){
        switch (type) {
            case 'FIFO':
              return new FIFO();
            default:
              {
                return new policy();
              }
    }
}
}
