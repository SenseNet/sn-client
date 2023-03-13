import { copyToClipboard } from '../src'

const mockWriteText = jest.fn()

// Mock navigator.clipboard.writeText
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
})

describe('copyToClipboard', () => {
  it('should call navigator.clipboard.writeText with the correct argument', async () => {
    const value = 'test value'
    await copyToClipboard(value)
    expect(mockWriteText).toHaveBeenCalledWith(value)
  })
})
