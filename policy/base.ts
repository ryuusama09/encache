class Policy {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  type(): string {
    return this.name;
  }

  get(...args : any[]): any {}
  put(...args : any[]): any {}
  safe(...args : any[]): any {}
  evict(...args : any[]): void {}
}

export default Policy;