
var sizeof = require('object-sizeof');

// the actual logic of put , get is left in the hands of the policy
class memory {

    constructor(){
        // limit memory
        this.store = Map();
    }
    createKey(...args){
        return "";  
    }

}



