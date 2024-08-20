class Node<T> { 
  public key: any;
  public value: T;
  public time: number;
  public prev: Node<T> | null;
  public next: Node<T> | null;

  constructor(key: any, value: T, time: number = 0) {
    this.key = key;
    this.value = value;
    this.time = time;
    this.prev = null;
    this.next = null;
  }
}

export default Node;
