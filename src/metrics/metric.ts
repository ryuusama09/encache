class Monitor {
    private memory: any; // Assuming memory is an object with a 'current' property
    private hits: number;
    private references: number;
    private evictions: number;
    private accessTime: number;
  
    constructor(memory: any) {
      this.memory = memory;
      this.hits = 0;
      this.references = 0;
      this.evictions = 0;
      this.accessTime = 0;
    }
  
    hit(): void {
      this.hits++;
    }
  
    reference(): void {
      this.references++;
    }
  
    evict(): void {
      this.evictions++;
    }
  
    access(diff: number): void {
      this.accessTime += diff;
    }
  
    hitRatio(): String{
      return ((1.0 * this.hits) / this.references).toFixed(3);
    }
  
    missRatio(): String{ 
      return (1 - Number(this.hitRatio())).toFixed(3);
    }
  
    memoryConsumption(): Number {
      return this.memory.current;
    }
  
    // latency(): number {
    //   return ((1.0 * this.accessTime) / this.references);
    // }
  
    fillRate(): string {
      return ((1.0 * this.memory.current) / this.memory.maxmemory).toFixed(3);
    }
  
    evictionRate(): string {
      return ((1.0 * this.evictions) / this.references).toFixed(3);
    }
  
    show(): void {
      // Implement show logic here
    }
  }
  export default Monitor; 