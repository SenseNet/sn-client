import 'jest'
import { suffixes } from '../src'

// tslint:disable:completed-docs
export const suffixesTest = describe('suffixes', () => {
  it('should contain the given strings', () => {
    expect(suffixes.loading).toBe('LOADING')
    expect(suffixes.success).toBe('SUCCESS')
    expect(suffixes.failure).toBe('FAILURE')
  })
})
