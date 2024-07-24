# Encache
## A lightweight , Inmemory Async Cache for your Nodejs Server 
### 1. Quick replacement for inmemory caches like memcache or redis 
### 2. No need to setup a cache server 
### 3. 2 lines of code required to setup the cache 

## Examples 
``` set up cache ```

``` const Cache = require('encache')```

``` const obj = new Cache(50)```

``` \\ 50 determines 50 bytes of cache memory limit```

``` obj.setPolicy('FIFO')```

``` \\ now use the aysnc methods get and put to access and update the cache ```





