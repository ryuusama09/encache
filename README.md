# Encache
## A lightweight , Inmemory Async Cache for your Nodejs Server 
### 1. Quick replacement for inmemory caches like memcache or redis 
### 2. No need to setup a cache server 
### 3. 2 lines of code required to setup the cache 

## Examples 
### importing the cache 

``` const Cache = require('encache')```
### or
``` import Cache from 'encache' ```

### creating the cache instance 
### by default it reserves 5000 bytes , else mention the memory limit in bytes while forming the object 
``` const obj = new Cache(50)```

``` \\ 50 determines 50 bytes of cache memory limit```

### set the cache policy 
### currently two policies are available :
###  1. FIFO
###  2. TTL
### eg : ``` obj.setPolicy('FIFO')```

### usage of cache methods to manage your data store 
### 1. get(key) --> async method (to be used with await)
### 2. put(key , data) --> async method

### metrics 
### hitRatio, missRatio , currentMemoryUsage . 





