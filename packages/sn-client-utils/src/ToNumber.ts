/**
 * Casts an arbitrary value to a number. Both null and undefined are treated as undefined values by default.
 * @param value An arbitrary value to convert to a number.
 * @param defaultValue The default value that is used when the specified value is either null or undefined values.
 * @returns Number | NaN | undefined
 * @example
 *    undefined = toNumber(undefined)
 *    undefined = toNumber(null)
 *    10        = toNumber(10)
 *    10        = toNumber('10')
 *    10        = toNumber({ toString() { return '10'; } })
 *    NaN       = toNumber('Hello')
 */
export function toNumber(value: any, defaultValue?: number): number | undefined {
  const num = value === null || value === undefined || value === '' ? defaultValue : +value
  return num
}
