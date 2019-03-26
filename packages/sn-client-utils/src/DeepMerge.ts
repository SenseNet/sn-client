/**
 * Type that defines a deep partial generic object
 */
export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> }

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export const deepMerge = <T>(target: T, ...sources: Array<DeepPartial<T> | undefined>) => {
  if (!sources.length) {
    return target
  }
  const merged = { ...target } as T
  for (const source of sources) {
    if (!source) {
      continue
    }
    const keys = Object.keys(source) as Array<keyof T>
    for (const key of keys) {
      if (!(source[key] instanceof Array) && typeof source[key] === 'object' && typeof target[key] === 'object') {
        merged[key] = deepMerge(target[key], source[key])
      } else if (source[key]) {
        ;(merged[key] as any) = source[key]
      }
    }
  }
  return merged
}
