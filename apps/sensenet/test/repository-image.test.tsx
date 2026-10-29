import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { act, create, ReactTestRenderer } from 'react-test-renderer'
import { ImageThumbnail } from '../src/components/image-thumbnail'
import { useRepositoryImage } from '../src/hooks/use-repository-image'
import { getImageContentUrl, getRepositoryBinaryUrl } from '../src/services/image-content-service'

const repositoryUrl = 'https://repository.example.test'
const imageContent = { Id: 42, Path: '/Root/Content/Photo.jpg', Name: 'Photo.jpg', Type: 'Image' } as GenericContent
const imageUrl = `${repositoryUrl}/binaryhandler.ashx?nodeid=42&propertyname=Binary`
const deferred = <T,>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((complete) => {
    resolve = complete
  })
  return { promise, resolve }
}
const response = (blob: Promise<Blob> = Promise.resolve(new Blob(['image'], { type: 'image/png' }))) => ({
  ok: true,
  blob: () => blob,
})

describe('Repository image URLs', () => {
  it('uses the binary handler when collection metadata omits Binary', () => {
    expect(getImageContentUrl(repositoryUrl, imageContent)).toBe(imageUrl)
    expect(getImageContentUrl(repositoryUrl, { ...imageContent, Version: 'V2.0.A' })).toBe(`${imageUrl}&version=V2.0.A`)
  })

  it('preserves valid relative and absolute binary metadata including its version', () => {
    for (const media_src of [
      '/binaryhandler.ashx?nodeid=42&version=V1.0.A',
      `${repositoryUrl}/binaryhandler.ashx?nodeid=42&version=V1.0.A`,
    ]) {
      const content = { ...imageContent, Binary: { __mediaresource: { media_src } } } as GenericContent
      expect(getImageContentUrl(repositoryUrl, content)).toBe(
        `${repositoryUrl}/binaryhandler.ashx?nodeid=42&version=V1.0.A`,
      )
    }
  })

  it('routes raw repository image media URLs through the handler while preserving version', () => {
    const content = {
      ...imageContent,
      Binary: { __mediaresource: { media_src: `${repositoryUrl}${imageContent.Path}?version=V1.0.A` } },
    } as GenericContent
    expect(getImageContentUrl(repositoryUrl, content)).toBe(`${imageUrl}&version=V1.0.A`)
  })

  it('does not direct authenticated requests to foreign or credential-bearing metadata URLs', () => {
    for (const media_src of [
      'https://external.example.test/image.png',
      'https://user:secret@repository.example.test/image.png',
      'data:image/png;base64,AAAA',
    ]) {
      const content = { ...imageContent, Binary: { __mediaresource: { media_src } } } as GenericContent
      expect(getImageContentUrl(repositoryUrl, content)).toBe(imageUrl)
    }
  })

  it('encodes generated preview paths through the binary handler without creating previews', () => {
    const path = '/Root/Content/With spaces & #/Previews/V1.0.A/thumbnail1.png'
    const url = new URL(getRepositoryBinaryUrl(repositoryUrl, path)!)
    expect(url.pathname).toBe('/binaryhandler.ashx')
    expect(url.searchParams.get('nodepath')).toBe(path)
    expect(url.searchParams.get('propertyname')).toBe('Binary')
  })

  it('handles missing or malformed sources without throwing in render', () => {
    expect(getImageContentUrl('invalid URL', imageContent)).toBeUndefined()
    expect(getImageContentUrl(repositoryUrl, {} as GenericContent)).toBeUndefined()
  })
})

describe('Repository image lifecycle', () => {
  let fetchImage: jest.Mock
  let repository: Repository
  let renderer: ReactTestRenderer | undefined
  let result: ReturnType<typeof useRepositoryImage>
  const Probe = ({ url = imageUrl }: { url?: string }) => {
    result = useRepositoryImage(repository, url)
    return null
  }

  beforeEach(() => {
    fetchImage = jest.fn().mockResolvedValue(response())
    repository = { configuration: { repositoryUrl }, fetch: fetchImage } as unknown as Repository
    URL.createObjectURL = jest.fn().mockReturnValue('blob:preview')
    URL.revokeObjectURL = jest.fn()
  })

  afterEach(() => {
    act(() => renderer?.unmount())
    renderer = undefined
  })

  it('uses repository authentication and releases its object URL on unmount', async () => {
    await act(async () => {
      renderer = create(<Probe />)
    })
    expect(fetchImage).toHaveBeenCalledWith(
      imageUrl,
      expect.objectContaining({ method: 'GET', credentials: 'include', signal: expect.any(AbortSignal) }),
    )
    expect(fetchImage.mock.calls[0][1].cache).not.toBe('force-cache')
    expect(result.source).toBe('blob:preview')
    act(() => renderer!.unmount())
    renderer = undefined
    expect(fetchImage.mock.calls[0][1].signal.aborted).toBe(true)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview')
  })

  it('contains fetch and HTTP failures without allocating an object URL', async () => {
    fetchImage.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await act(async () => {
      renderer = create(<Probe />)
    })
    expect(result.error).toBe('Failed to fetch')
    expect(result.isLoading).toBe(false)
    expect(URL.createObjectURL).not.toHaveBeenCalled()
    fetchImage.mockResolvedValueOnce({ ok: false, status: 403, statusText: 'Forbidden' })
    await act(async () => {
      renderer!.update(<Probe url={`${imageUrl}&version=V2.0.A`} />)
    })
    expect(result.error).toBe('403 Forbidden')
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })

  it('does not allocate an orphaned URL if blob reading finishes after unmount', async () => {
    const body = deferred<Blob>()
    fetchImage.mockResolvedValue(response(body.promise))
    await act(async () => {
      renderer = create(<Probe />)
    })
    act(() => renderer!.unmount())
    renderer = undefined
    await act(async () => {
      body.resolve(new Blob(['late image']))
    })
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })

  it('ignores stale responses after navigation and revokes the replaced image', async () => {
    const body = deferred<Blob>()
    fetchImage.mockResolvedValueOnce(response(body.promise)).mockResolvedValueOnce(response())
    await act(async () => {
      renderer = create(<Probe />)
    })
    await act(async () => {
      renderer!.update(<Probe url={`${imageUrl}&version=V2.0.A`} />)
    })
    expect(result.source).toBe('blob:preview')
    await act(async () => {
      body.resolve(new Blob(['stale image']))
    })
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
    expect(result.source).toBe('blob:preview')
    await act(async () => {
      renderer!.update(<Probe url={`${imageUrl}&version=V3.0.A`} />)
    })
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview')
  })

  it('rejects foreign image URLs before repository.fetch can add its token', async () => {
    await act(async () => {
      renderer = create(<Probe url="https://external.example.test/image.png" />)
    })
    expect(fetchImage).not.toHaveBeenCalled()
    expect(result.error).toMatch(/outside the current repository/)
  })

  it('keeps a failed thumbnail as an icon and does not refetch on unrelated content object changes', async () => {
    await act(async () => {
      renderer = create(<ImageThumbnail content={imageContent} repository={repository} />)
    })
    expect(renderer!.root.findAllByType('img')).toHaveLength(1)
    act(() => renderer!.root.findByType('img').props.onError())
    expect(renderer!.root.findAllByType('img')).toHaveLength(0)
    await act(async () => {
      renderer!.update(<ImageThumbnail content={{ ...imageContent }} repository={repository} />)
    })
    expect(fetchImage).toHaveBeenCalledTimes(1)
    expect(renderer!.root.findAllByType('img')).toHaveLength(0)
  })

  it('reloads an image after its modification date changes without changing its binary URL', async () => {
    await act(async () => {
      renderer = create(<ImageThumbnail content={imageContent} repository={repository} />)
    })
    await act(async () => {
      renderer!.update(
        <ImageThumbnail
          content={{ ...imageContent, ModificationDate: '2026-09-05T09:00:00Z' }}
          repository={repository}
        />,
      )
    })
    expect(fetchImage).toHaveBeenCalledTimes(2)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview')
  })
})
