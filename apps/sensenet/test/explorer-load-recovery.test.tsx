import { ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext, useEffect } from 'react'
import { render as renderDom, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import {
  CurrentAncestorsContext,
  CurrentAncestorsProvider,
} from '../../../packages/sn-hooks-react/src/context/current-ancestors'
import {
  CurrentChildrenContext,
  CurrentChildrenProvider,
} from '../../../packages/sn-hooks-react/src/context/current-children'
import {
  CurrentContentContext,
  CurrentContentProvider,
} from '../../../packages/sn-hooks-react/src/context/current-content'
import {
  LoadSettingsContext,
  LoadSettingsContextProps,
  LoadSettingsContextProvider,
} from '../../../packages/sn-hooks-react/src/context/load-settings'

const folder = (Id: number, Path: string) =>
  ({ Id, Path, Name: Path.split('/').pop(), Type: 'Folder' } as GenericContent)
const parent = folder(1, '/Root/Content')
const child = folder(2, '/Root/Content/Child')
const ancestor = folder(3, '/Root')
const childSettings: ODataParams<GenericContent> = { select: ['Id', 'Path'] }
const mockRepository = {
  load: jest.fn(),
  loadCollection: jest.fn(),
  executeAction: jest.fn(),
  configuration: { repositoryUrl: 'https://repository.example' },
}
const mockLogger = { error: jest.fn(), warning: jest.fn() }
const subscribe = () => ({ dispose: jest.fn() })
const mockEvents = Object.fromEntries(
  ['Modified', 'Created', 'Copied', 'Moved', 'Deleted', 'UploadFinished', 'CustomActionExecuted'].map((name) => [
    ['UploadFinished', 'CustomActionExecuted'].includes(name) ? `on${name}` : `onContent${name}`,
    { subscribe },
  ]),
)
jest.mock('../../../packages/sn-hooks-react/src/hooks', () => ({
  useRepository: () => mockRepository,
  useRepositoryEvents: () => mockEvents,
  useLogger: () => mockLogger,
}))
jest.mock('../../../packages/sn-hooks-react/src/hooks/use-localization', () => ({
  useLocalization: () => ({ currentContextError: 'Load failed' }),
}))

describe('Explorer reload without remounting consumers', () => {
  let container: HTMLDivElement
  const mount = jest.fn()
  const failure = jest.fn()
  let currentSettings: LoadSettingsContextProps
  const Consumer = () => {
    const content = useContext(CurrentContentContext)
    const children = useContext(CurrentChildrenContext)
    const ancestors = useContext(CurrentAncestorsContext)
    currentSettings = useContext(LoadSettingsContext)
    useEffect(() => {
      mount()
    }, [])
    return (
      <>
        <div data-test="content">{content.Path}</div>
        <div data-test="children">{children.map(({ Path }) => Path).join(',')}</div>
        <div data-test="ancestors">{ancestors.map(({ Path }) => Path).join(',')}</div>
      </>
    )
  }
  const render = async (refreshToken = 0, settings = childSettings) => {
    await act(async () => {
      renderDom(
        <LoadSettingsContextProvider loadChildrenSettings={settings}>
          <CurrentContentProvider idOrPath={parent.Path} onError={failure} refreshToken={refreshToken}>
            <CurrentChildrenProvider onError={failure} refreshToken={refreshToken}>
              <CurrentAncestorsProvider root="/Root" refreshToken={refreshToken}>
                <Consumer />
              </CurrentAncestorsProvider>
            </CurrentChildrenProvider>
          </CurrentContentProvider>
        </LoadSettingsContextProvider>,
        container,
      )
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockRepository.load.mockReset().mockImplementation(async () => ({ d: { ...parent } }))
    mockRepository.loadCollection.mockReset().mockResolvedValue({ d: { results: [child] } })
    mockRepository.executeAction.mockReset().mockResolvedValue({ d: { results: [ancestor] } })
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('recovers a failed current folder on the same path while keeping its consumers mounted', async () => {
    const error = new TypeError('Failed to fetch')
    mockRepository.load.mockRejectedValueOnce(error)
    await render()
    expect(failure).toHaveBeenCalledWith(error)
    await render(1)
    expect(container.querySelector('[data-test="content"]')?.textContent).toBe(parent.Path)
    expect(container.querySelector('[data-test="children"]')?.textContent).toBe(child.Path)
    expect(mockRepository.load).toHaveBeenCalledTimes(2)
    expect(mount).toHaveBeenCalledTimes(1)
  })

  it('retries a failed file list and reports the failure with its source path', async () => {
    const error = new TypeError('Failed to fetch children')
    mockRepository.loadCollection.mockRejectedValueOnce(error)
    await render()
    expect(failure).toHaveBeenCalledWith(error, parent.Path)
    await render(1)
    expect(container.querySelector('[data-test="children"]')?.textContent).toBe(child.Path)
    expect(mockRepository.loadCollection).toHaveBeenCalledTimes(2)
    expect(mount).toHaveBeenCalledTimes(1)
  })

  it('retries failed ancestors on the same path without recreating the command bar', async () => {
    mockRepository.executeAction.mockRejectedValueOnce(new TypeError('Failed to fetch ancestors'))
    await render()
    expect(mockLogger.warning).toHaveBeenCalledTimes(1)
    await render(1)
    expect(container.querySelector('[data-test="ancestors"]')?.textContent).toBe(ancestor.Path)
    expect(mockRepository.executeAction).toHaveBeenCalledTimes(2)
    expect(mount).toHaveBeenCalledTimes(1)
  })

  it('updates child query settings without restarting the content, ancestors, or consumers', async () => {
    await render()
    await render(0, { select: ['Id', 'Path', 'DisplayName'] })
    expect(mockRepository.loadCollection).toHaveBeenCalledTimes(2)
    expect(mockRepository.loadCollection.mock.calls[1][0].oDataOptions.select).toEqual(['Id', 'Path', 'DisplayName'])
    expect(mockRepository.load).toHaveBeenCalledTimes(1)
    expect(mockRepository.executeAction).toHaveBeenCalledTimes(1)
    expect(mount).toHaveBeenCalledTimes(1)
  })

  it('preserves user sorting when equivalent load settings arrive in a new object', async () => {
    await render()
    await act(async () => {
      currentSettings.setLoadChildrenSettings({ ...childSettings, orderby: [['Name', 'desc']] })
    })
    await render(0, { ...childSettings })
    expect(currentSettings.loadChildrenSettings.orderby).toEqual([['Name', 'desc']])
    expect(mockRepository.loadCollection).toHaveBeenCalledTimes(2)
    expect(mount).toHaveBeenCalledTimes(1)
  })
})
