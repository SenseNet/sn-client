/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export const mergeDeep = <T>(target: T, ...sources: Array<T | undefined>) => {
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
        merged[key] = mergeDeep(target[key], source[key])
      } else if (source[key]) {
        merged[key] = source[key]
      }
    }
  }
  return merged
}
