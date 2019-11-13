import { createAction } from '../src/createAction'
import { isFromAction } from '../src/isFromAction'

describe('Action helpers', () => {
  describe('createAction()', () => {
    it('Should add a type parameter to the action creator instance', () => {
      const a = createAction(() => ({ type: 'example' }))
      expect((a as any).actionType).toBe('example')
    })

    it('Should add a type parameter to the created action instance', () => {
      const a = createAction(() => ({ type: 'example' }))
      expect(a().type).toBe('example')
    })
  })

  describe('isFromAction', () => {
    it('Should return true on actionType equality', () => {
      const action = createAction(() => ({ type: 'example2' }))
      expect(isFromAction(action(), action)).toBe(true)
    })

    it('Should return false for different actions and creators', () => {
      const action = createAction(() => ({ type: 'example2' }))
      const action2 = createAction(() => ({ type: 'example3' }))
      expect(isFromAction(action(), action2)).toBe(false)
    })
  })
})
