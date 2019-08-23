import { ObservableValue, Trace } from '@sensenet/client-utils'
import { UploadProgressInfo } from '../src'
import { Repository } from '../src/Repository/Repository'

declare const global: any

global.File = class {
  public size = 1024
  public namme = 'file.txt'
  public slice() {
    return ''
  }
}
global.FormData = class {
  public append() {
    /** */
  }
}

describe('Upload', () => {
  let repo: Repository

  let mockAnswer: any

  let mockText: string

  let fetchOk = true

  beforeEach(() => {
    mockAnswer = {
      Id: 4037,
      Length: 18431,
      Name: 'LICENSE',
      // eslint-disable-next-line @typescript-eslint/camelcase
      Thumbnail_url: '/Root/Sites/Default_Site/Workspace/Document_Library/LICENSE',
      Type: 'File',
      Url: '/Root/Sites/Default_Site/Workspace/Document_Library/LICENSE',
    }
    mockText = ''
    fetchOk = true
    repo = new Repository(
      {},
      async () => ({ ok: fetchOk, json: async () => mockAnswer, text: async () => mockText } as any),
    )
  })

  afterEach(() => {
    repo.dispose()
  })

  describe('#isChunkedUploadNeeded()', () => {
    it('should return true is the file is larger than the chunk size', () => {
      repo = new Repository({ chunkSize: 640 })
      expect(repo.upload.isChunkedUploadNeeded({ size: 1024 } as any)).toBe(true)
    })

    it('should return false is the file is smaller than the chunk size', () => {
      expect(repo.upload.isChunkedUploadNeeded({ size: 1024 } as any)).toBe(false)
    })
  })

  describe('#text()', () => {
    it('should resolve on upload', async () => {
      const answer = await repo.upload.textAsFile({
        binaryPropertyName: 'Binary',
        overwrite: true,
        fileName: 'alma.txt',
        parentPath: 'Root/Example',
        text: 'ExampleText',
        contentTypeName: 'File',
        progressObservable: new ObservableValue<UploadProgressInfo>(),
      })
      expect(answer).toEqual(mockAnswer)
    })

    it('should resolve on upload without contentTypeName', async () => {
      const answer = await repo.upload.textAsFile({
        binaryPropertyName: 'Binary',
        overwrite: true,
        fileName: 'alma.txt',
        parentPath: 'Root/Example',
        text: 'ExampleText',
        progressObservable: new ObservableValue<UploadProgressInfo>(),
      })
      expect(answer).toEqual(mockAnswer)
    })

    it('should throw on upload failure', done => {
      fetchOk = false
      repo.upload
        .textAsFile({
          binaryPropertyName: 'Binary',
          overwrite: true,
          fileName: 'alma.txt',
          parentPath: 'Root/Example',
          text: 'ExampleText',
          contentTypeName: 'File',
          progressObservable: new ObservableValue<UploadProgressInfo>(),
        })
        .then(() => {
          done(Error('Should throw'))
        })
        .catch(() => {
          done()
        })
    })
  })

  describe('#file()', () => {
    it('should resolve on upload chunked', async () => {
      fetchOk = true
      const answer = await repo.upload.file({
        binaryPropertyName: 'Binary',
        overwrite: true,
        parentPath: 'Root/Example',
        file: ({ size: 65535000, slice: () => '' } as any) as File,
        contentTypeName: 'File',
        progressObservable: new ObservableValue<UploadProgressInfo>(),
      })
      expect(answer).toEqual(mockAnswer)
    })

    it('Should throw on error chunked', done => {
      fetchOk = false
      repo.upload
        .file({
          binaryPropertyName: 'Binary',
          overwrite: true,
          file: ({ size: 65535000, slice: () => '' } as any) as File,
          parentPath: 'Root/Example',
          contentTypeName: 'File',
          progressObservable: new ObservableValue<UploadProgressInfo>(),
        })
        .then(() => {
          done(Error('Should throw'))
        })
        .catch(() => {
          done()
        })
    })

    it('Should throw if a chunk has been failed', done => {
      let ok = true
      repo['fetchMethod'] = async () => {
        return {
          ok,
          text: async () => '',
          json: async () => {
            ok = false
            return {}
          },
        } as any
      }
      repo.upload
        .file({
          binaryPropertyName: 'Binary',
          overwrite: true,
          file: ({ size: 65535000, slice: () => '' } as any) as File,
          parentPath: 'Root/Example',
          contentTypeName: 'File',
          progressObservable: new ObservableValue<UploadProgressInfo>(),
        })
        .then(() => {
          done(Error('Should throw'))
        })
        .catch(() => {
          done()
        })
    })
  })

  describe('#fromDropEvent()', () => {
    it('should trigger an Upload request without webkitRequestFileSystem', done => {
      ;(global as any).window.webkitRequestFileSystem = undefined
      const file = new File(['alma.txt'], 'alma')
      Object.assign(file, { type: 'file' })
      const uploadTrace = Trace.method({
        object: repo.upload,
        method: repo.upload.file,
        onCalled: () => {
          uploadTrace.dispose()
          done()
        },
      })
      repo.upload.fromDropEvent({
        event: {
          dataTransfer: {
            files: [file, {}],
          },
        } as any,
        parentPath: 'Root/Example',
        createFolders: true,
        binaryPropertyName: 'Binary',
        contentTypeName: 'File',
        overwrite: true,
        progressObservable: new ObservableValue<UploadProgressInfo>(),
      })
    })

    it('should trigger an Upload request with webkitRequestFileSystem', done => {
      ;(global as any).window.webkitRequestFileSystem = () => {
        /**/
      }
      const uploadTrace = Trace.method({
        object: repo.upload,
        method: repo.upload.file,
        onCalled: () => {
          uploadTrace.dispose()
          done()
        },
      })
      const file = {
        isFile: true,
        file: (cb: (f: File) => void) => {
          cb(new File(['alma.txt'], 'alma'))
        },
      }
      repo.upload.fromDropEvent({
        event: {
          dataTransfer: {
            items: [{ webkitGetAsEntry: () => file }],
            files: [],
          },
        } as any,
        parentPath: 'Root/Example',
        createFolders: true,
        binaryPropertyName: 'Binary',
        contentTypeName: 'File',
        overwrite: true,
      })
    })

    it('should fail with webkitRequestFileSystem if failed to read a file', done => {
      ;(global as any).window = {
        webkitRequestFileSystem: () => {
          /**/
        },
      }
      const file = {
        isFile: true,
        file: (_cb: (f: File) => void, err: (err: any) => void) => {
          err('File read fails here...')
        },
      }
      repo.upload
        .fromDropEvent({
          event: {
            dataTransfer: {
              items: [{ webkitGetAsEntry: () => file }],
            },
          } as any,
          parentPath: 'Root/Example',
          createFolders: true,
          binaryPropertyName: 'Binary',
          contentTypeName: 'File',
          overwrite: true,
        })
        .catch(() => {
          done()
        })
    })

    it('should trigger a post when the dataTransfer contains folders', done => {
      ;(global as any).window = {
        webkitRequestFileSystem: () => {
          /**/
        },
      }

      repo['fetchMethod'] = async () =>
        ({
          ok: true,
          json: async () => ({ d: { Path: 'Root/Example' } }),
        } as any)

      let postHasCalled = false
      const uploadTrace = Trace.method({
        object: repo,
        method: repo.post,
        onCalled: () => {
          uploadTrace.dispose()
          postHasCalled = true
        },
      })
      const directory = {
        isFile: false,
        isDirectory: true,
        createReader: () => {
          return {
            readEntries: (cb: (entries: any) => void) => {
              cb([
                {
                  isFile: true,
                  isDirectory: false,
                  name: 'ExampleDirectory',
                  file: (callback: (f: File) => void) => {
                    callback(new File(['alma.txt'], 'alma'))
                  },
                },
              ])
            },
          }
        },
      }
      repo.upload
        .fromDropEvent({
          event: {
            dataTransfer: {
              items: [{ webkitGetAsEntry: () => directory }],
              files: [],
            },
          } as any,
          progressObservable: new ObservableValue<UploadProgressInfo>(),
          parentPath: 'Root/Example',
          createFolders: true,
          binaryPropertyName: 'Binary',
          contentTypeName: 'File',
          overwrite: true,
        })
        .then(() => {
          expect(postHasCalled).toBe(true)
          done()
        })
        .catch(err => {
          done(err)
        })
    })

    it('should fail if there is an error reading folders', done => {
      ;(global as any).window = {
        webkitRequestFileSystem: () => {
          /**/
        },
      }

      const directory = {
        isFile: false,
        isDirectory: true,
        createReader: () => {
          return {
            readEntries: (_cb: (entries: any) => void, err: (err: any) => void) => {
              err('Reading directories fails here...')
            },
          }
        },
      }
      repo.upload
        .fromDropEvent({
          event: {
            dataTransfer: {
              items: [{ webkitGetAsEntry: () => directory }],
            },
          } as any,
          parentPath: 'Root/Example',
          createFolders: true,
          binaryPropertyName: 'Binary',
          contentTypeName: 'File',
          overwrite: true,
        })
        .then(() => {
          done(Error('Should have failed'))
        })
        .catch(() => {
          done()
        })
    })
  })

  describe('#fromFileList', () => {
    const file = {
      isFile: true,
      webkitRelativePath: '/example',
      file: (cb: (f: File) => void) => {
        cb(new File(['alma.txt'], 'alma'))
      },
    }
    const file2 = {
      isFile: true,
      webkitRelativePath: '/example/sub/',
      file: (cb: (f: File) => void) => {
        cb(new File(['alma.txt'], 'alma'))
      },
    }
    const file3 = {
      isFile: true,
      webkitRelativePath: '/example/sub/2',
      file: (cb: (f: File) => void) => {
        cb(new File(['alma.txt'], 'alma'))
      },
    }

    it('should trigger an Upload request when uploading with folders', done => {
      ;(global as any).window = {
        webkitRequestFileSystem: () => {
          /**/
        },
      }
      const uploadTrace = Trace.method({
        object: repo.upload,
        method: repo.upload.file,
        onCalled: () => {
          uploadTrace.dispose()
          done()
        },
      })

      repo.upload.fromFileList({
        fileList: ([file, file2, file3] as any) as FileList,
        parentPath: 'Root/Example',
        createFolders: true,
        binaryPropertyName: 'Binary',
        contentTypeName: 'File',
        overwrite: true,
      })
    })

    it('should trigger an Upload request without folder upload', done => {
      ;(global as any).window = {
        webkitRequestFileSystem: () => {
          /**/
        },
      }
      const uploadTrace = Trace.method({
        object: repo.upload,
        method: repo.upload.file,
        onCalled: () => {
          uploadTrace.dispose()
          done()
        },
      })

      repo.upload.fromFileList({
        fileList: ([file, file2, file3] as any) as FileList,
        parentPath: 'Root/Example',
        createFolders: false,
        binaryPropertyName: 'Binary',
        contentTypeName: 'File',
        overwrite: true,
      })
    })
  })
})
