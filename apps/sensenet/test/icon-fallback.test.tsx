import { Repository } from '@sensenet/client-core'
import { Injector } from '@sensenet/client-utils'
import { File, GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { render as renderDom, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { Icon } from '../src/components/Icon'
import { IconFromPath } from '../src/components/IconFromPath'

const schemas: Record<string, { ContentTypeName: string; ParentTypeName?: string }> = {
  File: { ContentTypeName: 'File', ParentTypeName: 'GenericContent' },
  Folder: { ContentTypeName: 'Folder', ParentTypeName: 'GenericContent' },
  Settings: { ContentTypeName: 'Settings', ParentTypeName: 'GenericContent' },
  PersonalizationSettings: { ContentTypeName: 'PersonalizationSettings', ParentTypeName: 'Settings' },
}
const mockRepository = {
  configuration: { repositoryUrl: 'https://first.example' },
  fetch: jest.fn(),
  schemas: {
    getSchemaByName: (name: string) => schemas[name] || { ContentTypeName: 'GenericContent' },
    isContentFromType: (item: GenericContent, type: string) => item.Type === type,
  },
}
jest.mock('@sensenet/hooks-react', () => ({ useRepository: () => mockRepository, useInjector: () => ({}) }))
jest.mock('@iconify-icons/logos/circleci', () => ({}))
jest.mock('@iconify-icons/logos/gatsby', () => ({}))
jest.mock('@iconify-icons/logos/heroku-icon', () => ({}))
jest.mock('@iconify-icons/logos/netlify', () => ({}))
jest.mock('@iconify-icons/logos/travis-ci', () => ({}))
jest.mock('@iconify-icons/logos/vercel-icon', () => ({}))
const validSvg = '<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1v1z" /></svg>'
const success = () => ({ ok: true, text: async () => validSvg })

describe('Default icons for missing content icons', () => {
  let container: HTMLDivElement
  let pathNumber = 0
  const renderContent = async (overrides: Partial<File> = {}) => {
    await act(async () => {
      renderDom(
        <Icon
          item={{ Id: 1, Type: 'Unknown', Path: '/Root/Content/Item', ...overrides }}
          style={{ width: 20, height: 20 }}
        />,
        container,
      )
    })
  }
  const renderPath = async (path: string, repository = mockRepository) => {
    await act(async () => {
      renderDom(
        <IconFromPath
          path={path}
          options={{ repo: repository as unknown as Repository, injector: {} as Injector }}
          fallback={<span data-test="fallback">Default icon</span>}
        />,
        container,
      )
    })
  }
  const fallback = () => container.querySelector('[data-test="fallback"]')

  beforeEach(() => {
    jest.clearAllMocks()
    mockRepository.fetch.mockReset().mockResolvedValue(success())
    pathNumber++
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it.each([{}, { IsFolder: true }, { IsFile: true }, { Icon: 'MissingIcon' }])(
    'provides a local default icon for content without a usable icon: %j',
    async (content) => {
      await renderContent(content)
      expect(container.querySelector('svg')).not.toBeNull()
      expect(container.querySelector('svg')?.style.width).toBe('20px')
      expect(container.querySelector('img')).toBeNull()
      expect(mockRepository.fetch).not.toHaveBeenCalled()
    },
  )

  it('uses named and inherited icons without treating their names as image paths', async () => {
    await renderContent({ Type: 'File', Icon: 'File', Name: 'document.txt' })
    expect(container.querySelector('svg')).not.toBeNull()
    expect(container.querySelector('img')).toBeNull()
    await renderContent({ Type: 'PersonalizationSettings', Icon: 'UnknownSettingsIcon', Name: 'a.settings' })
    expect(container.querySelector('svg')).not.toBeNull()
    expect(container.querySelector('img')).toBeNull()
    expect(mockRepository.fetch).not.toHaveBeenCalled()
  })

  it('replaces a broken raster image with its fallback', async () => {
    await renderPath(`/Root/Icons/${pathNumber}/missing.png`)
    const image = container.querySelector('img')
    expect(image).not.toBeNull()
    act(() => {
      image!.dispatchEvent(new Event('error'))
    })
    expect(container.querySelector('img')).toBeNull()
    expect(fallback()).not.toBeNull()
  })

  it.each(['http', 'network', 'invalid'])('keeps the fallback when an SVG fails with %s', async (failure) => {
    if (failure === 'http') mockRepository.fetch.mockResolvedValue({ ok: false })
    if (failure === 'network') mockRepository.fetch.mockRejectedValue(new TypeError('Failed to fetch'))
    if (failure === 'invalid')
      mockRepository.fetch.mockResolvedValue({ ok: true, text: async () => '<html>Error</html>' })
    await renderPath(`/Root/Icons/${pathNumber}/missing.svg`)
    expect(fallback()).not.toBeNull()
    expect(container.querySelector('img')).toBeNull()
  })

  it('shows a fallback during loading and ignores an old SVG after the icon changes', async () => {
    let resolveOld!: (value: ReturnType<typeof success>) => void
    const pending = new Promise<ReturnType<typeof success>>((resolve) => {
      resolveOld = resolve
    })
    mockRepository.fetch.mockReturnValueOnce(pending).mockResolvedValueOnce({ ok: false })
    await renderPath(`/Root/Icons/${pathNumber}/pending.svg`)
    expect(fallback()).not.toBeNull()
    await renderPath(`/Root/Icons/${pathNumber}/new.svg`)
    await act(async () => resolveOld(success()))
    expect(fallback()).not.toBeNull()
    expect(container.querySelector('svg')).toBeNull()
  })

  it('keeps a missing repository icon separate from the same path in another repository', async () => {
    const path = `/Root/Icons/${pathNumber}/shared.svg`
    mockRepository.fetch.mockResolvedValue({ ok: false })
    await renderPath(path)
    expect(fallback()).not.toBeNull()
    const otherRepository = {
      ...mockRepository,
      configuration: { repositoryUrl: 'https://second.example' },
      fetch: jest.fn().mockResolvedValue(success()),
    }
    await renderPath(path, otherRepository)
    expect(otherRepository.fetch).toHaveBeenCalledWith(`https://second.example${path}`, { cache: 'force-cache' })
    expect(fallback()).toBeNull()
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('uses the inherited file icon when a custom SVG is missing', async () => {
    mockRepository.fetch.mockResolvedValue({ ok: false })
    await renderContent({ Type: 'File', Icon: `/Root/Icons/${pathNumber}/missing.svg`, IsFile: true })
    expect(container.querySelector('svg')).not.toBeNull()
    expect(container.querySelector('img')).toBeNull()
  })

  it('replaces an unavailable document preview icon with its file icon', async () => {
    await renderContent({ Type: 'File', IsFile: true, PageCount: 1, Version: 'V1.0.D' })
    const image = container.querySelector('img')
    expect(image).not.toBeNull()
    act(() => {
      image!.dispatchEvent(new Event('error'))
    })
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('uses a file icon when projected preview metadata omits the version', async () => {
    await renderContent({ Type: 'File', IsFile: true, PageCount: 1 })
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('svg')).not.toBeNull()
  })
})
