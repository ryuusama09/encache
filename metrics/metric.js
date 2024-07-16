const sizeof = require('object-sizeof')
class monitor {

    constructor(memory){
        this.memory = memory
        this.hits = 0;
        this.references = 0;
    }
    hitRatio(){
        return this.hits/this.references
    }
    missRatio(){
        return 1 - this.hitRatio()
    }
    memoryConsumption(){
        return sizeof(this.memory.module)
    }
    Latency(){ 
        
    } 
    cpuUtilization(){
        return ""
    }



    // function to calculate hit ratio 
   // function to calculate miss ratio
   // avg latency
   //memory consumption
   // cpu utilization
}
