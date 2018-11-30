import { expect } from 'chai'
import { suffixes } from '../src'

// tslint:disable:completed-docs
export const suffixesTest: Mocha.Suite = describe('suffixes', () => {
  it('should contain the given strings', () => {
    expect(suffixes.loading).to.be.eq('LOADING')
    expect(suffixes.success).to.be.eq('SUCCESS')
    expect(suffixes.failure).to.be.eq('FAILURE')
  })
})
