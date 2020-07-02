import {
  Content,
  LoadCollectionOptions,
  LoadOptions,
  ODataBatchResponse,
  ODataCollectionResponse,
  ODataResponse,
  Repository,
} from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { EventHub } from '../src'

/**
 * Unit tests for the Repository Event Hub
 */
export const eventHubTests = describe('EventHub', () => {
  let repository: Repository
  let eventHub: EventHub

  const mockContent = {
    Id: 123,
    Name: 'mook',
    Path: 'Root/Example',
  } as Content

  beforeEach(() => {
    repository = new Repository({}, async () => ({ ok: true } as any))
    eventHub = new EventHub(repository)
  })

  afterEach(() => {
    repository.dispose()
    eventHub.dispose()
  })

  it('should be constructed', () => {
    expect(eventHub).toBeInstanceOf(EventHub)
  })

  it('should be disposed', () => {
    eventHub.dispose()
  })

  describe('Content Created', () => {
    it('should be triggered after post', (done) => {
      eventHub.onContentCreated.subscribe((c) => {
        expect(c.content).toEqual(mockContent)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: true,
          json: async () => {
            return {
              d: mockContent,
            } as ODataResponse<Content>
          },
        } as any)
      repository.post({
        parentPath: '',
        contentType: 'User',
        content: mockContent,
      })
    })

    it('fail should be trigger after post failed', (done) => {
      eventHub.onContentCreateFailed.subscribe((c) => {
        expect(c.content).toEqual(mockContent)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: false,
          json: async () => {
            return { content: mockContent }
          },
        } as any)
      ;(async () => {
        try {
          await repository.post({
            parentPath: '',
            contentType: 'User',
            content: mockContent,
          })
        } catch {
          // ignore...
        }
      })()
    })

    it('should be trigger after copy', (done) => {
      eventHub.onContentCopied.subscribe((c) => {
        expect(c.content).toEqual(mockContent)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: true,
          json: async () => {
            return {
              d: {
                __count: 1,
                errors: [],
                results: [mockContent],
              },
            } as ODataBatchResponse<Content>
          },
        } as any)
      repository.copy({
        idOrPath: 123,
        rootContent: mockContent,
        targetPath: 'Root/Example/Target/Path',
      })
    })

    it('should trigger failed after copy failed', (done) => {
      eventHub.onContentCopyFailed.subscribe((c) => {
        expect(c.content).toEqual(mockContent)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: true,
          json: async () => {
            return {
              d: {
                __count: 1,
                errors: [{ error: 'error', content: mockContent }],
                results: [],
              },
            } as ODataBatchResponse<Content>
          },
        } as any)
      repository.copy({
        idOrPath: 123,
        rootContent: mockContent,
        targetPath: 'Root/Example/Target/Path',
      })
    })

    it('should trigger failed if copyBatch operation has been failed ', (done) => {
      eventHub.onContentCopyFailed.subscribe((c) => {
        expect(c.content).toEqual({ Id: 321 })
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: false,
        } as any)
      ;(async () => {
        try {
          await repository.copy({
            targetPath: 'Root/Example/Target',
            idOrPath: 321,
          })
        } catch (error) {
          /** ignore */
        }
      })()
    })

    it('should trigger failed if copyBatch operation has been failed with an array of pathes', (done) => {
      eventHub.onContentCopyFailed.subscribe((c) => {
        expect(c.content).toEqual({ Path: 'Root/Example/Path1' })
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: false,
        } as any)
      ;(async () => {
        try {
          await repository.copy({
            targetPath: 'Root/Example/Target',
            idOrPath: ['Root/Example/Path1'],
          })
        } catch (error) {
          /** ignore */
        }
      })()
    })
  })

  describe('Content Modified', () => {
    it('should be trigger after patch', (done) => {
      eventHub.onContentModified.subscribe((c) => {
        expect(c.content).toEqual(mockContent)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: true,
          json: async () => {
            return {
              d: mockContent,
            } as ODataResponse<Content>
          },
        } as any)
      repository.patch({
        idOrPath: 123,
        content: mockContent,
      })
    })

    it('fail should be triggered after patch failed', (done) => {
      eventHub.onContentModificationFailed.subscribe((c) => {
        expect(c.content).toEqual(mockContent)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: false,
          json: async () => {
            return { content: mockContent }
          },
        } as any)
      ;(async () => {
        try {
          await repository.patch({
            content: mockContent,
            idOrPath: 123,
          })
        } catch {
          // ignore...
        }
      })()
    })

    it('should be trigger after put', (done) => {
      eventHub.onContentModified.subscribe((c) => {
        expect(c.content).toEqual(mockContent)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: true,
          json: async () => {
            return {
              d: mockContent,
            } as ODataResponse<Content>
          },
        } as any)
      repository.put({
        idOrPath: 123,
        content: mockContent,
      })
    })
  })

  it('fail should be triggered after put failed', (done) => {
    eventHub.onContentModificationFailed.subscribe((c) => {
      expect(c.content).toEqual(mockContent)
      done()
    })
    repository['fetch'] = async () =>
      ({
        ok: false,
        json: async () => {
          return { content: mockContent }
        },
      } as any)
    ;(async () => {
      try {
        await repository.put({
          content: mockContent,
          idOrPath: 123,
        })
      } catch {
        // ignore...
      }
    })()
  })

  describe('Content Deleted', () => {
    it('should be triggered after delete', (done) => {
      eventHub.onContentDeleted.subscribe((c) => {
        expect(c.contentData).toEqual(mockContent)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: true,
          json: async () => {
            return {
              d: {
                __count: 1,
                results: [mockContent],
                errors: [],
              },
            } as ODataBatchResponse<Content>
          },
        } as any)
      repository.delete({
        idOrPath: 123,
      })
    })

    it('failed should be triggered after delete succeed with errors', (done) => {
      eventHub.onContentDeleteFailed.subscribe((c) => {
        expect(c.content).toEqual(mockContent)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: true,
          json: async () => {
            return {
              d: {
                __count: 1,
                results: [],
                errors: [
                  {
                    error: 'alma',
                    content: mockContent,
                  },
                ],
              },
            } as ODataBatchResponse<Content>
          },
        } as any)
      repository.delete({
        idOrPath: 123,
      })
    })

    it('failed should be triggered if deleteBatch operation has been failed', (done) => {
      eventHub.onContentDeleteFailed.subscribe((c) => {
        expect(c.content).toEqual({ Id: 123 })
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: false,
        } as any)
      ;(async () => {
        try {
          await repository.delete({
            idOrPath: 123,
          })
        } catch (error) {
          /** ignore */
        }
      })()
    })

    it('failed should be triggered if deleteBatch operation has been failed with an array of pathes', (done) => {
      eventHub.onContentDeleteFailed.subscribe((c) => {
        expect(c.content).toEqual({ Path: 'Root/Example/Path1' })
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: false,
        } as any)
      ;(async () => {
        try {
          await repository.delete({
            idOrPath: ['Root/Example/Path1'],
          })
        } catch (error) {
          /** ignore */
        }
      })()
    })
  })

  describe('Content Move', () => {
    it('should be triggered after move', (done) => {
      eventHub.onContentMoved.subscribe((c) => {
        expect(c.content).toEqual(mockContent)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: true,
          json: async () => {
            return {
              d: {
                __count: 1,
                results: [mockContent],
                errors: [],
              },
            } as ODataBatchResponse<Content>
          },
        } as any)
      repository.move({
        idOrPath: 123,
        targetPath: 'Root/Example/TargetPath',
      })
    })

    it('failed should be triggered after move succeed with errors', (done) => {
      eventHub.onContentMoveFailed.subscribe((c) => {
        expect(c.content).toEqual(mockContent)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: true,
          json: async () => {
            return {
              d: {
                __count: 1,
                results: [],
                errors: [
                  {
                    error: 'alma',
                    content: mockContent,
                  },
                ],
              },
            } as ODataBatchResponse<Content>
          },
        } as any)
      repository.move({
        targetPath: 'Root/Example',
        idOrPath: 123,
      })
    })

    it('failed should be triggered if moveBatch operation has been failed', (done) => {
      eventHub.onContentMoveFailed.subscribe((c) => {
        expect(c.content).toEqual({ Id: 123 })
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: false,
        } as any)
      ;(async () => {
        try {
          await repository.move({
            idOrPath: 123,
            targetPath: 'Root/Example',
          })
        } catch (error) {
          /** ignore */
        }
      })()
    })

    it('failed should be triggered if moveBatch operation has been failed with an array of pathes', (done) => {
      eventHub.onContentMoveFailed.subscribe((c) => {
        expect(c.content).toEqual({ Path: 'Root/Example/Path1' })
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: false,
        } as any)
      ;(async () => {
        try {
          await repository.move({
            idOrPath: ['Root/Example/Path1'],
            targetPath: 'Root/Example/Target',
          })
        } catch (error) {
          /** ignore */
        }
      })()
    })
  })

  describe('load', () => {
    it('onContentLoaded() should be triggered after load', (done) => {
      eventHub.onContentLoaded.subscribe((c) => {
        expect(c.content).toEqual(mockContent)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: true,
          json: async () => {
            return {
              d: mockContent,
            } as ODataResponse<Content>
          },
        } as any)
      repository.load({
        idOrPath: 1,
      })
    })

    it('onContentLoadFailed() should be trigger after load failed', (done) => {
      const payload: LoadOptions<GenericContent> = {
        idOrPath: 1,
      }

      eventHub.onContentLoadFailed.subscribe((c) => {
        expect(c.payload).toEqual(payload)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: false,
          json: async () => {
            return { content: mockContent }
          },
        } as any)
      ;(async () => {
        try {
          await repository.load(payload)
        } catch {
          // ignore...
        }
      })()
    })
  })

  describe('loadCollection', () => {
    it('onContentCollectionLoaded() should be triggered after load', (done) => {
      const mockResponse: ODataCollectionResponse<Partial<GenericContent>> = {
        d: {
          __count: 3,
          results: [{ Id: 123 }, { Id: 234 }, { Id: 345 }],
        },
      }

      eventHub.onContentCollectionLoaded.subscribe((c) => {
        expect(c).toEqual(mockResponse)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: true,
          json: async () => {
            return mockResponse
          },
        } as any)
      repository.loadCollection({
        path: 'Root/Content',
      })
    })

    it('onContentLoadFailed() should be trigger after load failed', (done) => {
      const payload: LoadCollectionOptions<GenericContent> = {
        path: 'Root/Content',
      }

      eventHub.onContentCollectionLoadFailed.subscribe((c) => {
        expect(c.payload).toEqual(payload)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: false,
          json: async () => {
            return { content: mockContent }
          },
        } as any)
      ;(async () => {
        try {
          await repository.loadCollection(payload)
        } catch {
          // ignore...
        }
      })()
    })
    const mockAnswer = {
      Id: 4037,
      Length: 18431,
      Name: 'LICENSE',

      Thumbnail_url: '/Root/Sites/Default_Site/Workspace/Document_Library/LICENSE',
      Type: 'File',
      Url: '/Root/Sites/Default_Site/Workspace/Document_Library/LICENSE',
    }

    it('onUploadFinished() should be triggered after chuncked upload', (done) => {
      eventHub.onUploadFinished.subscribe((response) => {
        expect(response).toEqual(mockAnswer)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: true,
          json: async () => mockAnswer,
          text: async () => '',
        } as any)
      repository.upload.uploadChunked({
        binaryPropertyName: 'Binary',
        overwrite: true,
        parentPath: 'Root/Example',
        file: ({ size: 1, name: 'LICENSE', slice: jest.fn() } as unknown) as File,
        contentTypeName: 'File',
      })
    })

    it('onUploadFailed() should be triggered after chuncked upload failed', async () => {
      const options = {
        binaryPropertyName: 'Binary',
        overwrite: true,
        parentPath: 'Root/Example',
        file: ({ size: 1, name: 'LICENSE', slice: jest.fn() } as unknown) as File,
        contentTypeName: 'File',
      }
      const onUploadFailed = jest.fn()
      eventHub.onUploadFailed.subscribe(onUploadFailed)
      repository['fetch'] = async () =>
        ({
          ok: false,
          json: async () => {
            return {
              error: {
                message: {
                  value: 'error',
                },
              },
            }
          },
          text: async () => '',
        } as any)
      try {
        await repository.upload.uploadChunked(options)
      } catch {
        expect(onUploadFailed).toBeCalled()
      }
    })

    it('onUploadFinished() should be triggered after nonchuncked upload', (done) => {
      eventHub.onUploadFinished.subscribe((response) => {
        expect(response).toEqual(mockAnswer)
        done()
      })
      repository['fetch'] = async () =>
        ({
          ok: true,
          json: async () => mockAnswer,
          text: async () => '',
        } as any)
      repository.upload.uploadNonChunked({
        binaryPropertyName: 'Binary',
        overwrite: true,
        parentPath: 'Root/Example',
        file: ({ size: 1, name: 'LICENSE', slice: jest.fn() } as unknown) as File,
        contentTypeName: 'File',
      })
    })

    it('onUploadFailed() should be triggered after nonchuncked upload failed', async () => {
      const options = {
        binaryPropertyName: 'Binary',
        overwrite: true,
        parentPath: 'Root/Example',
        file: ({ size: 1, name: 'LICENSE', slice: jest.fn() } as unknown) as File,
        contentTypeName: 'File',
      }
      const onUploadFailed = jest.fn()
      eventHub.onUploadFailed.subscribe(onUploadFailed)
      repository['fetch'] = async () =>
        ({
          ok: false,
          json: async () => {
            return {
              error: {
                message: {
                  value: 'error',
                },
              },
            }
          },
          text: async () => '',
        } as any)
      try {
        await repository.upload.uploadNonChunked(options)
      } catch {
        expect(onUploadFailed).toBeCalled()
      }
    })
  })
})
