import { sleepAsync } from '../src'

describe('FilterAsync', () => {
  it('Should return the original array in case of truthy values', async () => {
    const arr = [1, 2, 3]
    const filtered = await arr.filterAsync(async () => true)
    expect(filtered).toEqual(arr)
  })

  it('Should return an empty array in case of falsy values', async () => {
    const arr = [1, 2, 3]
    const filtered = await arr.filterAsync(async () => false)
    expect(filtered).toEqual([])
  })

  it('Should return the correct values', async () => {
    const arr = [1, 2, 3, 4, 5]
    const filtered = await arr.filterAsync(async value => {
      await sleepAsync(1)
      return value % 2 === 0
    })
    expect(filtered).toEqual([2, 4])
  })
})
