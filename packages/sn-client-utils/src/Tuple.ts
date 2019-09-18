/**
 * Factory method for creating a Tuple instance.
 * @param args
 */
export const tuple = <T extends string[]>(...args: T) => args
