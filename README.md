![image](https://github.com/user-attachments/assets/608f2841-7a0f-400e-8370-d7c8dc24e37c)  

[![npm version](https://badge.fury.io/js/encache.svg)](https://badge.fury.io/js/encache)
![NPM License](https://img.shields.io/npm/l/encache)
![NPM Downloads](https://img.shields.io/npm/dy/encache)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/ryuusama09/encache/main)


#### A lightweight , Inmemory Async Cache for your Nodejs Server. <br/>
1. Quick replacement for inmemory caches like memcache or redis
2. No need to setup a cache server 
3. Just 2 lines of code required to setup the cache 

## Documentation 
### 
### 1. Downloading and importing the Encache Library
####
```bash
 npm install encache
```
To check the version of encache installed , use 

```bash
 npx encache --version
```

Now to import the cache object , use 
```js
//commonjs
const Cache = require('encache')
```
#### or
```js
//esmodule import
import Cache from 'encache'
 ```


### 2. Creating the cache instance 
by default the cache object reserves 5000 bytes as max memory limit .    
User can provide custom memory limit to their cache according to performance needs .  
The cache can be initiated by providing a set of options which are not compulsory.
```js
const options = {
  size : 5000,
  policy : "LRU",
  compression "none"
}
const store = new Cache(options)
```
or

```js
//initiating cache with default values
const store = new Cache({})
```


### 3. Set the cache policy 
#### currently five policies are available :
1. FIFO -> Standard Queue based first in , first out policy . Used as the default policy. 
2. Lazy-TTL -> Lazily checks for the volatile keys based on their time to live.
3. LRU -> Least recently used keys are evicted first.
4. Random Eviction -> Randomly Evicts the keys.
5. No Eviction -> Does not evict any keys if the cache memory limit is being exceeded.
6. LFU -> Evicts the least frequently used keys. 
 
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
3. The reset method allows the user to reset the cache .It flushes all the keys and resets the metrics and policy specific data.
```js
store.reset()
```
4. The keys method returns a list of all the available keys in the cache store
```js 
let keyList = store.keys()
console.log(keyList)
```

### 6. Metrics 
The following methods are 
1. Hit Ratio: calculated as (number of hits / number of references).
returns a floating point value 
 ```js
 return store.hitRatio()
 ```  
2. Miss Ratio: calculated as 1 - hitRatio
returns a floating point value 
 ```js
 return store.missRatio()
 ```  
3. Memory Consumption: Returns the approximate current size of the cache in bytes 
returns an Integer value 
 ```js
 return store.memoryConsumption()
 ```  
4. Fill Rate: The ratio of cache filled . calculated as (current memory/ max memory limit) 
returns a floating point value 
  ```js 
  return store.fillRate()
  ```
5. Eviction Rate: The rate at which keys are evicted 
returns a floating point value 
  ```js
  return store.evictionRate()
  ```
6. show: It logs all the metrics in console by default . 
```js
store.show()
```

### 7. Logger
Encache provides an in-house logger to trace the cache , its performance and key movements in a file ```logs/app.log ```.
For now the logger has been kept closely to cache's scope only and ,however in later iterations we will 
make it user centric and more suitable for user's custom logging needs.
Currently , you can:
1. Set the file logging level (FLL) for your cache. 
Options
  - warn
  - info
  - error
  - debug
  - off
  - all 

```js
store.logger.configureFLL(option)
```
### 8. Tests
Encache uses JEST testing framework to develop its core unit tests. The code coverage as of now 
is very low , but is expected to be gradually improved 
To run the tests , use the following command 

 1. without coverage report

 ```bash
 npm run test
 ```

 2. with coverage report

 ```bash
  npm run test-coverage
```
## THANK YOU FOR READING PATIENTLY 







