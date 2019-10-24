/**
 * Type that defines a constructable class
 */
export declare type Constructable<T> = (new (...args: any[]) => object) & (new (...args: any[]) => T)
