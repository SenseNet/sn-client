import { Repository } from '../src/Repository/Repository'
import { Preview } from '../src/Repository/Preview'
import { DocumentData, PreviewImageData } from '../src/Models'

describe('Preview', () => {
  let preview: Preview
  let repository: Repository
  let mockDocument: DocumentData

  beforeEach(() => {
    repository = new Repository({}, async () => ({ ok: true, json: async () => ({}), text: async () => '' } as any))
    preview = new Preview(repository)
    mockDocument = {
      hostName: 'https://example.com',
      idOrPath: 1,
      documentName: 'example',
      documentType: 'File',
      fileSizekB: 3,
      shapes: {
        redactions: [],
        annotations: [],
        highlights: [],
      },
      pageCount: 2,
      pageAttributes: [],
    }
  })

  it('Should execute regenerate', () => {
    expect(preview.regenerate({ idOrPath: 1 })).toBeInstanceOf(Promise)
  })

  it('Should execute getPageCount', () => {
    expect(preview.getPageCount({ idOrPath: 1 })).toBeInstanceOf(Promise)
  })

  it('Should return created preview for a page', async () => {
    const mockResponse = {
      PreviewAvailable: '/example.jpg',
    }

    const mockResult = {
      ...mockResponse,
      PreviewImageUrl: `${mockDocument.hostName}${mockResponse.PreviewAvailable}`,
      ThumbnailImageUrl: `${mockDocument.hostName}${mockResponse.PreviewAvailable}`,
    }

    repository.executeAction = async () => Promise.resolve(mockResponse) as any
    const result = await preview.available({ document: mockDocument, version: '', page: 1 })

    expect(result).toEqual(mockResult)
  })

  it('Should return all the previews', async () => {
    const mockResponse = [
      {
        PreviewAvailable: '/Root/Content/IT/Document_Library/Brazzaville/100pages.docx/Previews/V1.0.A/preview1.png',
        Width: 1240,
        Height: 1754,
        Index: 1,
      },
    ]

    repository.executeAction = async () => Promise.resolve(mockResponse as PreviewImageData[]) as any

    const result = await preview.getExistingImages({ document: mockDocument, version: '' })
    expect(result).toEqual([
      mockResponse[0],
      {
        Index: 2,
      },
    ])
  })

  it('Should execute check', () => {
    expect(preview.check({ idOrPath: 1, generateMissing: true })).toBeInstanceOf(Promise)
  })

  describe('Comment operators', () => {
    it('Should execute addComment', () => {
      expect(
        preview.addComment({ idOrPath: 1, comment: { page: 1, x: '1', y: '1', text: 'Test comment' } }),
      ).toBeInstanceOf(Promise)
    })

    it('Should execute getComments', () => {
      expect(preview.getComments({ idOrPath: 1, page: 1 })).toBeInstanceOf(Promise)
    })

    it('Should execute deleteComment', () => {
      expect(preview.deleteComment({ idOrPath: 1, commentId: '40' })).toBeInstanceOf(Promise)
    })
  })
})
