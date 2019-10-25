import { Action } from 'redux'
import { isPromiseMiddlewareAction, PromiseMiddlewareAction } from '../src'

/**
 * Test suite for isPromiseMiddlewareAction type guard
 */
export const isPromiseMiddlewareActionTest = describe('PromiseMiddleware', () => {
  it('Should return true for PromiseMiddlewareActions', () => {
    const action: PromiseMiddlewareAction<any, any> = {
      type: 'EXAMPLE_ACTION',
      payload: () => Promise.resolve(false),
    }
    expect(isPromiseMiddlewareAction(action)).toBeTruthy()
  })

  it("Should return false if the action doesn't have payload", () => {
    const action: Action = {
      type: 'EXAMPLE_ACTION',
    }
    expect(isPromiseMiddlewareAction(action)).toBeFalsy()
  })
  it('Should return false if the action payload is not a method', () => {
    const action = {
      type: 'EXAMPLE_ACTION',
      payload: 1,
    }
    expect(isPromiseMiddlewareAction(action)).toBe(false)
  })
})
