![image](https://github.com/user-attachments/assets/608f2841-7a0f-400e-8370-d7c8dc24e37c)

#### A lightweight , Inmemory Async Cache for your Nodejs Server. <br/>
1. Quick replacement for inmemory caches like memcache or redis
2. No need to setup a cache server 
3. 2 lines of code required to setup the cache 

## Documentation 
### 
### 1. Downloading and importing the Encache Library
####
```bash
$ npm install encache
```
Now to import the cache object , use 
```js
const Cache = require('encache')
```
#### or
```js
import Cache from 'encache'
 ```

### 2. Creating the cache instance 
by default the cache object reserves 5000 bytes as max memory limit .    
User can provide custom memory limit to their cache according to performance needs .  

```js
const store = new Cache(50)
```

### 3. Set the cache policy 
#### currently five policies are available :
1. FIFO -> Standard Queue based first in , first out policy . Used as the default policy. 
2. Lazy-TTL -> Lazily checks for the volatile keys based on their time to live.
3. LRU -> Least recently used keys are evicted first.
4. Random Eviction -> Randomly Evicts the keys.
5. No Eviction -> Does not evict any keys if the cache memory limit is being exceeded.
 
```js
store.setPolicy('FIFO')
```
#### When you set the policy to ttl , you can set the time to live for the 
#### cache elements in milliseconds 
```js
 //set the volatility to 1000 ms  
 store.setTTL(1000)
```

### 4. Set the cache Compression mode
The cache provides an option to compress the data to improve 
memory efficiency . It currently has two options 
1. LZ4 -> works well for partially random or non random data . 
2. Default ( No compression)   
```js
 store.setCompression('LZ4')
```  

### 5. Usage of cache methods to manage your data store
 1. The get method is an async method used to fetch the data stored on a key. It returns data.
```js
const fetch = async(key) =>{
 return await store.get(key)
}
```
2. The put method is also an async method used to store the {key , value}  pair in the cache. It returns nothing.
```js
const insert = async(key ,data) =>{
 await store.put(key , data)
 return;
}
```

### 6. Metrics 
1. calculated as (number of hits / number of references)
 ```js
 return store.hitRatio()
 ```  
2.  calculated as 1 - hitRatio
 ```js
 return store.missRatio()
 ```  
3. Returns the current size of the cache in bytes 
 ```js
 return store.memoryConsumption()
 ```  
4. The ratio of cache filled . calculated as (current memory/ max memory limit) 
  ```js 
  return store.fillRate()
  ```
5. The rate at which keys are evicted 
  ```js
  return store.evictionRate()
  ```






