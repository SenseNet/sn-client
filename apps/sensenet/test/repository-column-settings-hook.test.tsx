import React from 'react'
import { render as renderDom, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { useRepositoryColumnSettings } from '../src/hooks/use-repository-column-settings'
import { loadColumnSettings, resolveColumnSettingsSource } from '../src/services/column-settings-service'

const mockLogger = { warning: jest.fn(), debug: jest.fn() }
const mockRepository = { configuration: { repositoryUrl: 'https://repo.example.test' } }
jest.mock('@sensenet/hooks-react', () => ({ useRepository: () => mockRepository, useLogger: () => mockLogger }))
jest.mock('../src/services', () => jest.requireMock('../src/services/column-settings-service'))
jest.mock('../src/services/column-settings-service', () => ({
  ...jest.requireActual('../src/services/column-settings-service'),
  loadColumnSettings: jest.fn(),
  resolveColumnSettingsSource: jest.fn(),
}))
const deferred = () => {
  let resolve!: (value: any) => void
  let reject!: (error: Error) => void
  const promise = new Promise<any>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}
const loadSettings = loadColumnSettings as jest.Mock
const loadSource = resolveColumnSettingsSource as jest.Mock
let state: ReturnType<typeof useRepositoryColumnSettings>
const Probe = ({ path, reloadToken = 0 }: { path: string; reloadToken?: number }) => {
  state = useRepositoryColumnSettings(path, undefined, reloadToken)
  return null
}
let container: HTMLDivElement
beforeEach(() => {
  jest.clearAllMocks()
  container = document.createElement('div')
  document.body.appendChild(container)
})
afterEach(() => {
  act(() => {
    unmountComponentAtNode(container)
  })
  container.remove()
})
const render = async (path: string, reloadToken = 0) => {
  await act(async () => {
    renderDom(<Probe path={path} reloadToken={reloadToken} />, container)
  })
}

describe('Column settings loading lifecycle', () => {
  it('retries a failed settings request on refresh without changing folders', async () => {
    loadSettings
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValue({ columns: [{ field: 'Name' }] })
    loadSource.mockResolvedValue({ kind: 'inherited' })
    await render('/Root/Content/A')
    expect(state.columnSettings).toBeUndefined()
    await render('/Root/Content/A', 1)
    expect(state.columnSettings).toEqual([{ field: 'Name' }])
    expect(state.isColumnSettingsLoading).toBe(false)
    expect(loadSettings).toHaveBeenCalledTimes(2)
  })

  it('shows inherited columns without waiting for optional source metadata', async () => {
    const pendingSource = deferred()
    loadSource.mockReturnValue(pendingSource.promise)
    loadSettings.mockResolvedValue({ columns: [{ field: 'DisplayName' }] })
    await render('/Root/Content/A')
    expect(state.isColumnSettingsLoading).toBe(false)
    expect(state.columnSettings).toEqual([{ field: 'DisplayName' }])
    expect(state.columnSettingsSource).toBeUndefined()
    await act(async () => {
      pendingSource.resolve({ kind: 'inherited' })
    })
    expect(state.columnSettingsSource?.kind).toBe('inherited')
  })

  it('discards both successful and failed responses from folders already left', async () => {
    const firstSettings = deferred()
    const firstSource = deferred()
    loadSettings.mockReturnValueOnce(firstSettings.promise).mockResolvedValue({ columns: [{ field: 'Name' }] })
    loadSource
      .mockReturnValueOnce(firstSource.promise)
      .mockResolvedValue({ kind: 'local', currentPath: '/Root/Content/B' })
    await render('/Root/Content/A')
    const firstSignal = loadSettings.mock.calls[0][2] as AbortSignal
    await render('/Root/Content/B')
    expect(firstSignal.aborted).toBe(true)
    await act(async () => {
      firstSettings.resolve({ columns: [{ field: 'OldField' }] })
      firstSource.reject(new TypeError('Failed to fetch'))
    })
    expect(state.columnSettings).toEqual([{ field: 'Name' }])
    expect(state.columnSettingsSource?.currentPath).toBe('/Root/Content/B')
    expect(mockLogger.warning).not.toHaveBeenCalled()
    expect(mockLogger.debug).not.toHaveBeenCalled()
  })

  it('falls back and finishes loading on a real failure without waiting for source lookup', async () => {
    loadSettings.mockRejectedValue(new TypeError('Failed to fetch'))
    loadSource.mockReturnValue(new Promise(() => undefined))
    await render('/Root/Content/A')
    expect(state.isColumnSettingsLoading).toBe(false)
    expect(state.columnSettings).toBeUndefined()
    expect(mockLogger.warning).toHaveBeenCalledTimes(1)
  })

  it('clears the previous folders columns while loading a new folder', async () => {
    const pendingSettings = deferred()
    loadSettings
      .mockResolvedValueOnce({ columns: [{ field: 'OnlyForA' }] })
      .mockReturnValueOnce(pendingSettings.promise)
    loadSource.mockResolvedValue({ kind: 'none' })
    await render('/Root/Content/A')
    await render('/Root/Content/B')
    expect(state.isColumnSettingsLoading).toBe(true)
    expect(state.columnSettings).toBeUndefined()
    await act(async () => {
      pendingSettings.resolve(undefined)
    })
    expect(state.isColumnSettingsLoading).toBe(false)
    expect(mockLogger.warning).not.toHaveBeenCalled()
  })
})
