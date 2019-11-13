import { tuple } from '../src'

describe('Tuple', () => {
  it('Should return a Tuple object', () => {
    expect(tuple('a', 'b', 'c')).toEqual(['a', 'b', 'c'])
  })
})
