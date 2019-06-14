import 'jest'
import { isPromise } from '../src/IsPromise'

export const isPromiseTest = describe('IsPromise', () => {
  it('Returns true with a Promise as a param', () => {
    const promise = new Promise(resolve => {
      setTimeout(resolve, 100, 'foo')
    })
    expect(isPromise(promise)).toBeTruthy()
  })
  it('Returns false with a non-Promise param', () => {
    expect(isPromise({})).toBeFalsy()
  })
})
