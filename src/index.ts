// This file is the entry point for the cache module.

// const policyFactory = require('./policy/policy')
// const memory = require('./memory/module')
// const monitor = require('./metrics/metric')
// const { compressorFactory, Compressor } = require('./encoding/encoder')
// const Logger = require('./logger/logger')
// const FIFO = require('./policy/fifo')
// const sizeof = require('object-sizeof')

// class cache {
//     constructor(size = 5000) {
//         this.size = size
//         this.memory = new memory(size)
//         this.compressor = new Compressor()
//         this.monitor = new monitor(this.memory)
//         this.policy = new FIFO(this.memory, this.monitor)
//         this.logger = new Logger({},this.monitor)
//     }
//     safe(data){
//         return sizeof(data) <= this.memory.maxmemory
//     }
//     reset(){
//         delete this.memory
//         this.memory = new memory(this.size)
//         delete this.monitor
//         this.monitor = new monitor(this.memory)
//         const type = this.policy.type()
//         delete this.policy
//         this.policy = policyFactory.create(type , this.memory , this.monitor , this.logger)
//     }
//     keys(){
//         return this.policy.keys()
//     }
//     setCompression(method) {
//         try {
//             this.compressor = compressorFactory.create(method)
//         } catch (e) {
//            console.error(e)
//         }
//     }
//     setPolicy(policy) {
//         try{
//             this.policy = policyFactory.create(policy, this.memory, this.monitor , this.logger)
//         } catch(err){
//            this.logger.log(err , "error")
//         }   
//     }
//     setTTL(ttl) {
//         try {
//             if (this.policy.type() !== 'TTL') { throw new Error('policy not set to TTL') }
//             this.policy.setTTL(ttl)
//         } catch (err) {
//             this.logger.log(err , "error")
//         }

//     }
//     async put(key, data) {
//         try{
//         this.monitor.reference()
//         if(!this.safe(data)){throw new Error("Data size exceeds cache size")}
//         data = await this.compressor.compress(data)
//         await this.policy.put(key, data)
//         }catch(err){
//             this.logger.log(err, "error")
//         }
//     }
//     async get(key) {
//         this.monitor.reference()
//         let data = await this.policy.get(key)
//         return await this.compressor.decompress(data)
//     }
//     hitRatio() {
//         return this.monitor.hitRatio()
//     }
//     missRatio() {
//         return this.monitor.missRatio()
//     }
//     memoryConsumption() {
//         return this.monitor.memoryConsumption()
//     }
//     fillRate() {
//         return this.monitor.fillRate()
//     }
//     evictionRate() {
//         return this.monitor.evictionRate()
//     }
//     show() {
//         this.logger.show()
//     }



// }
// module.exports = cache

import memory from './memory/module';
import monitor from './metrics/metric';
import { compressorFactory, Compressor } from './encoding/encoder';
import Logger from './logger/logger';
import {FIFO , policyFactory} from './policy/index';
import sizeof from 'object-sizeof';

interface CacheOptions {
  size?: number;
}

class Cache {
  
  private size: number;
  private memory: memory;
  private compressor: Compressor;
  private monitor: monitor;
  private policy: any;
  public logger: Logger;

  constructor(options: CacheOptions = {}) {
    this.size = options.size || 5000;
    this.memory = new memory({limit : this.size});
    this.compressor = new Compressor();
    this.monitor = new monitor(this.memory);
    this.logger = new Logger({}, this.monitor);
    this.policy = new FIFO({memory : this.memory, monitor : this.monitor , logger : this.logger});
  }

  safe(data: any): boolean {
    return sizeof(data) <= this.memory.maxmemory;
  }

  reset(): void {
    delete this.memory;
    this.memory = new memory({limit : this.size});
    delete this.monitor;
    this.monitor = new monitor(this.memory);
    const type = this.policy.type();
    delete this.policy;
    this.policy = policyFactory.create(type, { memory: this.memory, monitor : this.monitor, logger : this.logger});
  }

  keys(): string[] {
    return this.policy.keys();
  }

  setCompression(method: string): void {
    try {
      this.compressor = compressorFactory.create(method);
    } catch (e) {
      console.error(e);
    }
  }

  setPolicy(policy: any): void {
    try {
      this.policy = policyFactory.create(policy,{ memory : this.memory,monitor : this.monitor,logger: this.logger});
    } catch (err) {
      this.logger.log(err, "error");
    }
  }

  setTTL(ttl: number): void {
    try {
      if (this.policy.type() !== 'TTL') {
        throw new Error('policy not set to TTL');
      }
      this.policy.setTTL(ttl);
    } catch (err) {
      this.logger.log(err, "error");
    }
  }

  async put(key: string, data: any): Promise<void> {
    try {
      this.monitor.reference();
      if (!this.safe(data)) {
        throw new Error("Data size exceeds cache size");
      }
      data = await this.compressor.compress(data);
      await this.policy.put(key, data);
    } catch (err) {
      this.logger.log(err, "error");
    }
  }

  async get(key: string): Promise<any> {
    this.monitor.reference();
    let data = await this.policy.get(key);
    return await this.compressor.decompress(data);
  }

  hitRatio(): any {
    return this.monitor.hitRatio();
  }

  missRatio(): any {
    return this.monitor.missRatio();
  }

  memoryConsumption(): any {
    return this.monitor.memoryConsumption();
  }

  fillRate(): any {
    return this.monitor.fillRate();
  }

  evictionRate(): any {
    return this.monitor.evictionRate();
  }

  show(): void {
    this.logger.show();
  }
}

export default Cache;

