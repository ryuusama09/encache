![image](https://github.com/user-attachments/assets/608f2841-7a0f-400e-8370-d7c8dc24e37c)

#### A lightweight , Inmemory Async Cache for your Nodejs Server. <br/>
1. Quick replacement for inmemory caches like memcache or redis
2. No need to setup a cache server 
3. 2 lines of code required to setup the cache 

## Documentation 
### 
### 1. Importing the cache 
####
``` npm install encache```  
``` const Cache = require('encache')```
#### or
``` import Cache from 'encache' ```

### 2. Creating the cache instance 
by default the cache object reserves 5000 bytes as max memory limit .    
User can provide custom memory limit to their cache according to performance needs .  

``` const store = new Cache(50)```

### 3. Set the cache policy 
#### currently three policies are available :
1. FIFO -> Standard Queue based first in , first out policy . Used as the default policy. 
2. Lazy-TTL -> Lazily checks for the volatile keys based on their time to live.
3. LRU -> Least recently used keys are evicted first.
4. Random Eviction -> Randomly Evicts the keys.
5. No Eviction -> Does not evict any keys if the cache memory limit is being exceeded.
 
```eg: store.setPolicy('FIFO')```
#### When you set the policy to ttl , you can set the time to live for the 
#### cache elements in milliseconds 
```\\ set the volatility to 1000 ms ```  
``` store.setTTL(1000)```

### 4. Set the cache Compression mode
The cache provides an option to compress the data to improve 
memory efficiency . It currently has two options 
1. LZ4 -> works well for partially random or non random data . 
2. Default ( No compression)   
``` store.setCompression('LZ4')```  

### 5. Usage of cache methods to manage your data store 
```1. store.get(key) --> async method (to be used with await)```  
```2. store.put(key , data) --> async method```

### 6. Metrics 
1. ```hitRatio()```  
2. ```missRatio()```  
3. ```memoryConsumption()```  
4. ```fillRate()```
5. ```evictionRate()```






