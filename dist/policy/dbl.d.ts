declare class Node<T> {
    key: any;
    value: T;
    time: number;
    prev: Node<T> | null;
    next: Node<T> | null;
    constructor(key: any, value: T, time?: number);
}
export default Node;
