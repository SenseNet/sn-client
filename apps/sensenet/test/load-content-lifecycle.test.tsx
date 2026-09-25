import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { useLoadContent } from '../src/hooks/use-loadContent'

const mockRepo = { load: jest.fn() }
jest.mock('@sensenet/hooks-react', () => ({ useRepository: () => mockRepo }))
let current: ReturnType<typeof useLoadContent>
const Probe = ({ path }: { path: string }) => {
  current = useLoadContent({ idOrPath: path })
  return null
}
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
