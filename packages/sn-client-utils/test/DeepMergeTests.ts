import { deepMerge } from '../src/DeepMerge'

describe('DeepMerge tests', () => {
  it('Should return the target object if no merge sources are defined', () => {
    const obj = { a: 1 }
    expect(deepMerge(obj)).toBe(obj)
  })

  it('Should merge simple values in one level', () => {
    expect(deepMerge({ a: 1, b: 0, c: 0 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('Should skip falsy sources', () => {
    expect(deepMerge({ a: 1, b: 0, c: 0 }, null as any, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('Should override arrays', () => {
    expect(deepMerge({ a: [0, 1, 2] }, { a: [1, 2, 3] })).toEqual({ a: [1, 2, 3] })
  })

  it('Should merge nested objects', () => {
    expect(deepMerge({ a: 1, b: { a: 1, b: 2 } }, { b: { a: 3 } })).toEqual({ a: 1, b: { a: 3, b: 2 } })
  })

  it('Should respect falsy but defined values (false)', () => {
    expect(deepMerge({ a: true }, { a: false })).toEqual({ a: false })
  })

  it('Should respect falsy but defined values (empty string)', () => {
    expect(deepMerge({ a: 'asdasd' }, { a: '' })).toEqual({ a: '' })
  })

  it('Should respect falsy but defined values (zero)', () => {
    expect(deepMerge({ a: 654 }, { a: 0 })).toEqual({ a: 0 })
  })
})
