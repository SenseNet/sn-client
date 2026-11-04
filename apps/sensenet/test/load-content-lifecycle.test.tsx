import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { useLoadContent } from '../src/hooks/use-loadContent'

const mockRepo = { load: jest.fn() }
jest.mock('@sensenet/hooks-react', () => ({ useRepository: () => mockRepo }))
let current: ReturnType<typeof useLoadContent>
const Probe = ({ path, refreshToken }: { path: string; refreshToken?: number }) => {
  current = useLoadContent({ idOrPath: path, refreshToken })
  return null
}
beforeEach(() => mockRepo.load.mockReset())
it('ignores an obsolete response even if the repository resolves after cancellation', async () => {
  const container = document.createElement('div')
  let resolveOld!: (value: any) => void
  mockRepo.load
    .mockReturnValueOnce(
      new Promise((resolve) => {
        resolveOld = resolve
      }),
    )
    .mockResolvedValue({ d: { Id: 2, Path: '/Root/New' } })
  try {
    await act(async () => {
      render(<Probe path="/Root/Old" />, container)
    })
    const { signal } = mockRepo.load.mock.calls[0][0].requestInit
    await act(async () => {
      render(<Probe path="/Root/New" />, container)
    })
    expect(signal.aborted).toBe(true)
    await act(async () => {
      resolveOld({ d: { Id: 1, Path: '/Root/Old' } })
    })
    expect(current.content?.Path).toBe('/Root/New')
    expect(mockRepo.load).toHaveBeenCalledTimes(2)
  } finally {
    act(() => {
      unmountComponentAtNode(container)
    })
  }
})

it('reloads the same content after success and clears a previous load error on retry', async () => {
  const container = document.createElement('div')
  mockRepo.load
    .mockRejectedValueOnce(new TypeError('Failed to fetch'))
    .mockResolvedValueOnce({ d: { Id: 1, Path: '/Root/Current', Name: 'Before' } })
    .mockResolvedValueOnce({ d: { Id: 1, Path: '/Root/Current', Name: 'After' } })
  try {
    await act(async () => {
      render(<Probe path="/Root/Current" />, container)
    })
    expect(current.error).toBeDefined()
    await act(async () => current.reload())
    expect(current.error).toBeUndefined()
    expect(current.content?.Name).toBe('Before')
    await act(async () => current.reload())
    expect(current.content?.Name).toBe('After')
    expect(mockRepo.load).toHaveBeenCalledTimes(3)
  } finally {
    act(() => {
      unmountComponentAtNode(container)
    })
  }
})

it('accepts an external refresh without remounting or changing the content path', async () => {
  const container = document.createElement('div')
  mockRepo.load.mockResolvedValue({ d: { Id: 1, Path: '/Root/Current' } })
  try {
    await act(async () => {
      render(<Probe path="/Root/Current" refreshToken={0} />, container)
    })
    await act(async () => {
      render(<Probe path="/Root/Current" refreshToken={1} />, container)
    })
    expect(mockRepo.load).toHaveBeenCalledTimes(2)
  } finally {
    act(() => {
      unmountComponentAtNode(container)
    })
  }
})
