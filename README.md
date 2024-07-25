# Encache
#### A lightweight , Inmemory Async Cache for your Nodejs Server. <br/>
1. Quick replacement for inmemory caches like memcache or redis
2. No need to setup a cache server 
3. 2 lines of code required to setup the cache 

## Documentation 
### 
### 1. Importing the cache 
####
``` const Cache = require('encache')```
#### or
``` import Cache from 'encache' ```

### 2. Creating the cache instance 
by default the cache object reserves 5000 bytes as max memory limit .    
User can provide custom memory limit to their cache according to performance needs .  

``` const store = new Cache(50)```

### 3. Set the cache policy 
#### currently three policies are available :
1. FIFO
2. TTL
3. LRU
 
```eg: store.setPolicy('FIFO')```
#### When you set the policy to ttl , you can set the time to live for the 
#### cache elements in milliseconds 
```\\ set the volatility to 1000 ms ```  
``` store.setTTL(1000)```

### 4. Usage of cache methods to manage your data store 
```1. store.get(key) --> async method (to be used with await)```  
```2. store.put(key , data) --> async method```

### 5. Metrics 
```1. hitRatio()```  
```2. missRatio()```  
```3. memoryConsumption()```





