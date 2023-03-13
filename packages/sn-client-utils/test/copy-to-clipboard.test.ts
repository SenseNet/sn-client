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

  it('should log an error message and return false when it fails to copy the text', async () => {
    const error = new Error('Failed to copy text')
    mockWriteText.mockRejectedValueOnce(error)

    const value = 'test value'
    const result = await copyToClipboard(value)

    expect(mockWriteText).toHaveBeenCalledWith(value)
    expect(result).toBe(error.message)
  })
})
