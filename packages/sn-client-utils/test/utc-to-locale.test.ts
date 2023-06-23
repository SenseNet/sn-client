import { convertUtcToLocale } from '../src'
describe('convertUtcToLocale', () => {
  const spy = jest.spyOn(console, 'error')

  afterEach(() => {
    spy.mockReset()
  })

  afterAll(() => {
    spy.mockRestore()
  })

  it('should convert UTC date string to locale format', () => {
    const utcDateString = '2022-03-23T10:30:00Z'
    const expectedLocaleDateString = new Intl.DateTimeFormat(window.navigator.language, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(new Date(utcDateString))

    const actualLocaleDateString = convertUtcToLocale(utcDateString)

    expect(actualLocaleDateString).toEqual(expectedLocaleDateString)
  })

  it('should log error to console when given an invalid date string', () => {
    const invalidDateString = 'invalid date string'

    convertUtcToLocale(invalidDateString)

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
