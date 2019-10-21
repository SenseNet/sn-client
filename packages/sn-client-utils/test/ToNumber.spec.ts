import { toNumber } from '../src'

describe('toNumber', () => {
  it('Should give back undefined for undefined and null', () => {
    const valueUndefined = toNumber(undefined)
    const valueNull = toNumber(null)
    expect(valueUndefined).toBeUndefined()
    expect(valueNull).toBeUndefined()
  })

  it('Should cast a string number to number', () => {
    const value = toNumber('10')
    expect(value).toBe(10)
  })

  it('Should give back the default value when it is provided and the first parameter is false', () => {
    const value = toNumber(undefined, 10)
    expect(value).toBe(10)
  })

  it('Should give back NaN if the value provided is not a number', () => {
    const value = toNumber('some string')
    expect(value).toBeNaN()
  })
})
