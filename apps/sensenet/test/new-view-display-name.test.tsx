import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { render as renderDom, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { NewView } from '../src/components/view-controls/new-view'

let mockSubmit: (content: GenericContent, contentTypeName?: string) => Promise<void>
const mockRepository = {
  post: jest.fn(),
  schemas: { getSchemaByName: () => ({ DisplayName: 'Folder' }) },
  configuration: { repositoryUrl: 'https://repository.example.test' },
}
const mockLogger = { information: jest.fn(), error: jest.fn() }

jest.mock('@sensenet/controls-react', () => ({
  NewView: ({ onSubmit }: { onSubmit: typeof mockSubmit }) => {
    mockSubmit = onSubmit
    return null
  },
}))
jest.mock('@sensenet/hooks-react', () => ({
  useRepository: () => mockRepository,
  useLogger: () => mockLogger,
}))
jest.mock('react-router-dom', () => ({ useHistory: () => ({}), useRouteMatch: () => ({ params: {} }) }))
jest.mock('../src/context', () => ({ LocalizationObject: { en: {} } }))
jest.mock('../src/globalStyles', () => ({ useGlobalStyles: () => ({}) }))
jest.mock('../src/hooks', () => ({
  usePersonalSettings: () => ({ language: 'en' }),
  useLocalization: () => ({
    forms: { submit: 'Save', cancel: 'Cancel' },
    addButton: { contentCreatedNotification: 'Created {0}', errorPostingContentNotification: 'Create failed' },
  }),
}))
jest.mock('../src/services', () => ({ navigateToAction: jest.fn() }))
jest.mock('../src/components/edit/default-content-type', () => ({ defaultContentType: '' }))
jest.mock('../src/components/edit/new-text-file', () => ({ NewTextFile: () => null }))
jest.mock('../src/components/react-control-mapper', () => ({ reactControlMapper: () => ({}) }))
jest.mock('../src/components/view-controls/common/styles', () => ({ useViewControlStyles: () => ({}) }))
jest.mock('../src/components/view-controls/common/view-title', () => ({ ViewTitle: () => null }))

const originalName = 'árvízTŰRŐ tükörfúrógép 鳥山明 japán és 你好'

describe('New content DisplayName default', () => {
  let container: HTMLDivElement
  const onCreated = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockRepository.post.mockResolvedValue({ d: { Name: 'generated-name', Path: '/Root/Content/generated-name' } })
    container = document.createElement('div')
    document.body.appendChild(container)
    act(() => {
      renderDom(
        <NewView contentTypeName="Folder" currentContentPath="/Root/Content" submitCallback={onCreated} />,
        container,
      )
    })
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it.each([
    ['missing', {}],
    ['empty', { DisplayName: '' }],
    ['null', { DisplayName: null }],
  ])('preserves the raw Name when DisplayName is %s', async (_, fields) => {
    const input = Object.freeze({ Name: originalName, Description: 'Keep all other fields', ...fields })
    await act(async () => mockSubmit(input as GenericContent))

    expect(mockRepository.post).toHaveBeenCalledWith({
      contentType: 'Folder',
      parentPath: '/Root/Content',
      contentTemplate: 'Folder',
      content: { ...input, DisplayName: originalName },
    })
    expect(input).toStrictEqual({ Name: originalName, Description: 'Keep all other fields', ...fields })
    expect(onCreated).toHaveBeenCalledTimes(1)
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it.each(['別の表示名 你好 — é 👩🏽‍💻', ' \u3000 '])(
    'keeps an explicitly entered DisplayName unchanged: %s',
    async (displayName) => {
      const input = Object.freeze({ Name: originalName, DisplayName: displayName })
      await act(async () => mockSubmit(input as GenericContent))

      expect(mockRepository.post.mock.calls[0][0].content).toStrictEqual(input)
      expect(input.DisplayName).toBe(displayName)
    },
  )

  it('keeps DisplayName-only creation without introducing a Name', async () => {
    const input = Object.freeze({ DisplayName: originalName })
    await act(async () => mockSubmit(input as GenericContent))

    expect(mockRepository.post.mock.calls[0][0].content).toStrictEqual(input)
  })

  it('does not introduce a DisplayName when both name fields are missing', async () => {
    const input = Object.freeze({ Description: 'Let the existing server validation handle missing names' })
    await act(async () => mockSubmit(input as GenericContent))

    expect(mockRepository.post.mock.calls[0][0].content).toStrictEqual(input)
  })
})
