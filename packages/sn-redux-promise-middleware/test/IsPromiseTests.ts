import 'jest'
import { isPromise } from '../src/IsPromise'

// tslint:disable:completed-docs

export const isPromiseTest = describe('IsPromise', () => {
  it('Returns true with a Promise as a param', () => {
    const promise = new Promise(resolve => {
      setTimeout(resolve, 100, 'foo')
    })
    // tslint:disable-next-line:no-unused-expression
    expect(isPromise(promise)).toBeTruthy()
  })
  it('Returns false with a non-Promise param', () => {
    // tslint:disable-next-line:no-unused-expression
    expect(isPromise({})).toBeFalsy()
  })
})
