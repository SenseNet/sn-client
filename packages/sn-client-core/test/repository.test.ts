import { using } from '@sensenet/client-utils'
import { ActionModel, ContentType, User } from '@sensenet/default-content-types'
import { ActionOptions, ODataWopiResponse, Repository, SharingLevel, SharingMode } from '../src'
import { Content } from '../src/Models/Content'
import { ODataCollectionResponse } from '../src/Models/ODataCollectionResponse'
import { ODataResponse } from '../src/Models/ODataResponse'
import { ODataSharingResponse } from '../src/Models/ODataSharingResponse'
import { ConstantContent } from '../src/Repository/ConstantContent'
import { isExtendedError } from '../src/Repository/Repository'

declare const global: any
global.window = {}
describe('Repository', () => {
  let repository: Repository
  const mockResponse = {
    ok: true,
    json: async () => ({}),
  } as Response

  const fetchMock: Repository['fetchMethod'] = async () => {
    return mockResponse
  }

  beforeEach(() => {
    repository = new Repository(undefined, fetchMock)
  })

  afterEach(() => {
    repository.dispose()
  })

  it('Should be constructed', () => {
    expect(repository).toBeInstanceOf(Repository)
  })

  it('Should be constructed with a built-in fetch method', done => {
    global.window.fetch = () => {
      done()
    }
    const fetchRepo = new Repository()
    ;(fetchRepo as any).fetchMethod()
  })

  it('Should be disposed', () => {
    using(new Repository(), r => {
      expect(r).toBeInstanceOf(Repository)
    })
  })

  describe('fetch', () => {
    it('Should await readyState by default', done => {
      repository.awaitReadyState = async () => {
        done()
      }
      repository.fetch('')
    })

    it('Should be able to skip awaiting readyState', done => {
      repository.awaitReadyState = async () => {
        done("Shouldn't be called")
      }
      repository['fetchMethod'] = (async () => {
        done()
      }) as any
      repository.fetch('', undefined, false)
    })
  })

  describe('Content operations', () => {
    describe('#load()', () => {
      it('should resolve with an OData response', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: ConstantContent.PORTAL_ROOT,
          } as ODataResponse<Content>
        }
        const resp = await repository.load({
          idOrPath: 1,
        })
        expect(resp.d).toEqual(ConstantContent.PORTAL_ROOT)
      })

      it('should throw on unsuccessfull request', done => {
        ;(mockResponse as any).ok = false
        repository
          .load({
            idOrPath: 1,
          })
          .then(() => {
            done('Should throw')
          })
          .catch(() => {
            done()
          })
      })
    })

    describe('count', () => {
      it('should construct the url to contain /$count', async () => {
        const countRepository = new Repository(undefined, input => {
          const url = input.toString()
          expect(url).toMatch(/http:\/\/localhost\/odata.svc\/Root\/Content\/\$count/g)
          return Promise.resolve({ ok: true, json: () => 42 }) as any
        })
        await countRepository.count({ path: '/Root/Content' })
      })

      it('should throw on unsuccessfull request', async () => {
        ;(mockResponse as any).ok = false
        await expect(repository.count({ path: 'Root/Content' })).rejects.toThrow()
      })
    })

    describe('#loadCollection()', () => {
      it('should resolve with a proper collection response', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: {
              __count: 1,
              results: [ConstantContent.PORTAL_ROOT],
            },
          } as ODataCollectionResponse<Content>
        }
        const resp = await repository.loadCollection({
          path: 'Root/Sites/Default_Site',
        })
        expect(resp.d.results[0]).toEqual(ConstantContent.PORTAL_ROOT)
      })

      it('should throw on unsuccessfull request', done => {
        ;(mockResponse as any).ok = false
        repository
          .loadCollection({
            path: 'Root/Sites/Default_Site',
          })
          .then(() => {
            done('Should throw')
          })
          .catch(() => {
            done()
          })
      })
    })

    describe('#post()', () => {
      it('should return with a promise', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: ConstantContent.PORTAL_ROOT,
          } as ODataResponse<Content>
        }
        const response = await repository.post({
          parentPath: 'Root/Sites/Default_Site',
          content: ConstantContent.PORTAL_ROOT,
          contentType: 'Task',
        })

        expect(response.d).toEqual(ConstantContent.PORTAL_ROOT)
      })

      it('should throw on unsuccessfull request', done => {
        ;(mockResponse as any).ok = false
        repository
          .post({
            parentPath: 'Root/Sites/Default_Site',
            content: ConstantContent.PORTAL_ROOT,
            contentType: 'Task',
          })
          .then(() => {
            done('Should throw')
          })
          .catch(() => {
            done()
          })
      })
    })

    describe('#patch()', () => {
      it('should return with a promise', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: ConstantContent.PORTAL_ROOT,
          } as ODataResponse<Content>
        }
        const response = await repository.patch({
          idOrPath: 'Root/Sites/Default_Site',
          content: ConstantContent.PORTAL_ROOT,
        })

        expect(response.d).toEqual(ConstantContent.PORTAL_ROOT)
      })

      it('should throw on unsuccessfull request', done => {
        ;(mockResponse as any).ok = false
        repository
          .patch({
            idOrPath: 'Root/Sites/Default_Site',
            content: ConstantContent.PORTAL_ROOT,
          })
          .then(() => {
            done('Should throw')
          })
          .catch(() => {
            done()
          })
      })
    })

    describe('#put()', () => {
      it('should return with a promise', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: ConstantContent.PORTAL_ROOT,
          } as ODataResponse<Content>
        }
        const response = await repository.put({
          idOrPath: 'Root/Sites/Default_Site',
          content: ConstantContent.PORTAL_ROOT,
        })

        expect(response.d).toEqual(ConstantContent.PORTAL_ROOT)
      })

      it('should throw on unsuccessfull request', done => {
        ;(mockResponse as any).ok = false
        repository
          .put({
            idOrPath: 'Root/Sites/Default_Site',
            content: ConstantContent.PORTAL_ROOT,
          })
          .then(() => {
            done('Should throw')
          })
          .catch(() => {
            done()
          })
      })
    })

    describe('#delete', () => {
      it('should resolve on success', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: {
              __count: 1,
              results: [ConstantContent.PORTAL_ROOT],
            },
          } as ODataCollectionResponse<Content>
        }
        const response = await repository.delete({
          idOrPath: 5,
          permanent: true,
        })

        expect(response.d.results[0]).toEqual(ConstantContent.PORTAL_ROOT)
      })

      it('should resolve with muliple content', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: {
              __count: 1,
              results: [ConstantContent.PORTAL_ROOT],
            },
          } as ODataCollectionResponse<Content>
        }
        const response = await repository.delete({
          idOrPath: [5, 'Root/Examples/ExampleDoc1'],
          permanent: true,
        })

        expect(response.d.results[0]).toEqual(ConstantContent.PORTAL_ROOT)
      })
    })

    describe('#move()', () => {
      it('should resolve on success', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: {
              __count: 1,
              results: [ConstantContent.PORTAL_ROOT],
            },
          } as ODataCollectionResponse<Content>
        }
        const response = await repository.move({
          idOrPath: 5,
          targetPath: 'Root/Example/Folder',
        })

        expect(response.d.results[0]).toEqual(ConstantContent.PORTAL_ROOT)
      })
    })

    describe('#copy()', () => {
      it('should resolve on success', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: {
              __count: 1,
              results: [ConstantContent.PORTAL_ROOT],
            },
          } as ODataCollectionResponse<Content>
        }
        const response = await repository.copy({
          idOrPath: 5,
          targetPath: 'Root/Example/Folder',
        })

        expect(response.d.results[0]).toEqual(ConstantContent.PORTAL_ROOT)
      })
    })

    describe('#getActions()', () => {
      it('should resolve on success', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: [{ Name: 'MockAction' }],
          } as { d: ActionModel[] }
        }
        const response = await repository.getActions({
          idOrPath: 'Root/Sites/Default_Site',
        })
        expect(response.d).toEqual([{ Name: 'MockAction' }])
      })

      it('should resolve on success with scenario', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: [{ Name: 'MockAction' }],
          } as { d: ActionModel[] }
        }
        const response = await repository.getActions({
          idOrPath: 'Root/Sites/Default_Site',
          scenario: 'example',
        })
        expect(response.d).toEqual([{ Name: 'MockAction' }])
      })

      it('should throw on unsuccessfull request', done => {
        ;(mockResponse as any).ok = false
        ;(mockResponse as any).statusText = ':('
        repository
          .getActions({
            idOrPath: 'Root/Sites/Default_Site',
          })
          .then(() => {
            done('Should throw')
          })
          .catch(err => {
            expect(err.message).toBe(':(')
            done()
          })
      })
    })

    describe('#getImplicitAllowedChildTypes()', () => {
      it('should resolve on success', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: { results: [], __count: 0 },
          } as ODataCollectionResponse<ContentType>
        }
        const response = await repository.getImplicitAllowedChildTypes({
          idOrPath: 'Root/Sites/Default_Site',
        })
        expect(response.d).toEqual({ results: [], __count: 0 })
      })

      it('should throw on unsuccessfull request', done => {
        ;(mockResponse as any).ok = false
        ;(mockResponse as any).statusText = ':('
        repository
          .getImplicitAllowedChildTypes({
            idOrPath: 'Root/Sites/Default_Site',
          })
          .then(() => {
            done('Should throw')
          })
          .catch(err => {
            expect(err.message).toBe(':(')
            done()
          })
      })
    })

    describe('#getExplicitAllowedChildTypes()', () => {
      it('should resolve on success', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: { results: [], __count: 0 },
          } as ODataCollectionResponse<ContentType>
        }
        const response = await repository.getExplicitAllowedChildTypes({
          idOrPath: 'Root/Sites/Default_Site',
        })
        expect(response.d).toEqual({ results: [], __count: 0 })
      })

      it('should throw on unsuccessfull request', done => {
        ;(mockResponse as any).ok = false
        ;(mockResponse as any).statusText = ':('
        repository
          .getExplicitAllowedChildTypes({
            idOrPath: 'Root/Sites/Default_Site',
          })
          .then(() => {
            done('Should throw')
          })
          .catch(err => {
            expect(err.message).toBe(':(')
            done()
          })
      })
    })

    describe('#getAllowedChildTypes()', () => {
      it('should resolve on success', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return []
        }
        const response = await repository.getAllowedChildTypes({
          idOrPath: 'Root/Sites/Default_Site',
        })
        expect(response).toEqual({ d: { __count: 0, results: [] } })
      })
      it('should throw on unsuccessfull request', done => {
        ;(mockResponse as any).ok = false
        ;(mockResponse as any).statusText = ':('
        repository
          .getAllowedChildTypes({
            idOrPath: 'Root/Sites/Default_Site',
          })
          .then(() => {
            done('Should throw')
          })
          .catch(err => {
            expect(err.message).toBe(':(')
            done()
          })
      })
    })

    describe('#getWopiData()', () => {
      it('should resolve on success', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            accesstoken: 'aaa',
            expiration: 120.0,
            actionUrl: 'https://test.com',
            faviconUrl: 'https://test.com/wv/resources/1033/FavIcon_Word.ico',
          }
        }
        const response = await repository.getWopiData({ idOrPath: 'Root/Sites/Default_Site' })
        expect(response).toEqual({
          accesstoken: 'aaa',
          expiration: 120.0,
          actionUrl: 'https://test.com',
          faviconUrl: 'https://test.com/wv/resources/1033/FavIcon_Word.ico',
        } as ODataWopiResponse)
      })
      it('should throw on unsuccessfull request', done => {
        ;(mockResponse as any).ok = false
        ;(mockResponse as any).statusText = ':('
        repository
          .getWopiData({ idOrPath: 'Root/Sites/Default_Site' })
          .then(() => {
            done('Should throw')
          })
          .catch(err => {
            expect(err.message).toBe(':(')
            done()
          })
      })
    })

    describe('#executeAction()', () => {
      it('should resolve on success', async () => {
        ;(mockResponse as any).ok = true
        mockResponse.json = async () => {
          return {
            d: ConstantContent.PORTAL_ROOT,
          } as ODataResponse<Content>
        }
        const response = await repository.executeAction<{}, ODataResponse<Content>>({
          name: 'MockAction',
          idOrPath: 'Root/Sites/Default_Site',
          method: 'GET',
          body: {},
        })
        expect(response.d).toEqual(ConstantContent.PORTAL_ROOT)
      })

      it('should throw on unsuccessfull request', done => {
        ;(mockResponse as any).ok = false
        repository
          .executeAction<{}, ODataResponse<Content>>({
            name: 'MockAction',
            idOrPath: 'Root/Sites/Default_Site',
            method: 'GET',
            body: {},
          })
          .then(() => {
            done('Should throw')
          })
          .catch(() => {
            done()
          })
      })
    })
  })

  /**
   * If there is an API change and these cases breaks, please update them in the **readme.md** as well.
   */
  describe('Readme examples', () => {
    beforeEach(() => {
      ;(mockResponse as any).ok = true
    })

    it('Creating a new Repository', () => {
      repository = new Repository({
        repositoryUrl: 'https://my-sensenet-site.com',
        oDataToken: 'OData.svc',
        sessionLifetime: 'expiration',
        defaultSelect: ['DisplayName', 'Icon'],
        requiredSelect: ['Id', 'Type', 'Path', 'Name'],
        defaultMetadata: 'no',
        defaultInlineCount: 'allpages',
        defaultExpand: [],
        defaultTop: 1000,
      })
    })

    it('Load', async () => {
      await repository.load<User>({
        idOrPath: '/Root/IMS/BuiltIn/Portal/Visitor', // you can also load by content Id
        oDataOptions: {
          expand: ['CreatedBy'],
          select: 'all',
        },
      })
    })

    it('Load collection', async () => {
      await repository.loadCollection<User>({
        path: '/Root/IMS/BuiltIn/Portal',
        oDataOptions: {
          query: 'TypeIs:User',
          orderby: ['LoginName'],
        },
      })
    })

    it('POST/PATCH/PUT', async () => {
      await repository.post<User>({
        parentPath: 'Root/Parent',
        contentType: 'User',
        content: {
          Name: 'NewContent',
          /** ...additional content data */
        },
      })

      // you can use PUT in the similar way
      await repository.patch<User>({
        idOrPath: 'Root/Path/To/User',
        content: {
          Locked: true,
        },
      })
    })

    it('Batch operations', async () => {
      // you can use move in the similar way
      await repository.copy({
        idOrPath: [45, 'Root/Path/To/Content'],
        targetPath: 'Root/Target/Path',
      })

      await repository.delete({
        idOrPath: 'Root/Path/To/Content/To/Delete',
        permanent: true,
      })
    })

    it('Custom action', async () => {
      interface CustomActionBodyType {
        Name: string
        Value: string
      }
      interface CustomActionReturnType {
        Result: any
      }

      await repository.executeAction<CustomActionBodyType, CustomActionReturnType>({
        idOrPath: 'Path/to/content',
        method: 'POST',
        name: 'MyOdataCustomAction',
        body: {
          Name: 'foo',
          Value: 'Bar',
        },
      })
    })
  })

  describe('#reloadSchema', () => {
    it('Should execute the proper custom action', done => {
      repository.executeAction = async (options: ActionOptions<any, any>) => {
        expect(options.name).toBe('GetSchema')
        expect(options.idOrPath).toBe('Root')
        expect(options.method).toBe('GET')
        done()
        return {} as any
      }
      repository.reloadSchema()
    })
  })

  describe('#extendedError', () => {
    it('isExtendedError should return with false if the response is not attached', async () => {
      expect(isExtendedError(Error(''))).toBe(false)
    })

    it('Should be generated from Repository errors with the statusText if no response body is available', async () => {
      const e = await repository.getErrorFromResponse({
        // json: async () => ({}),
        statusText: 'statusText',
      } as Response)
      expect(e).toBeInstanceOf(Error)
      expect(isExtendedError(e)).toBe(true)
      expect(e.message).toBe('statusText')
    })

    it('Should be generated from Repository errors from the response body message', async () => {
      const e = await repository.getErrorFromResponse({
        json: async () => ({ error: { message: { value: 'errorValue' } } }),
        statusText: 'invalid',
      } as Response)
      expect(e).toBeInstanceOf(Error)
      expect(isExtendedError(e)).toBe(true)
      expect(e.message).toBe('errorValue')
    })
  })
  describe('#share()', () => {
    it('should return with a promise', async () => {
      ;(mockResponse as any).ok = true
      mockResponse.json = async () => {
        return {
          Token: 'alba@sensenet.com',
        } as ODataSharingResponse
      }
      const response = await repository.share({
        content: ConstantContent.PORTAL_ROOT,
        identity: 'alba@sensenet.com',
        sharingLevel: SharingLevel.Open,
        sharingMode: SharingMode.Private,
        sendNotification: false,
      })

      expect(response.Token).toEqual('alba@sensenet.com')
    })
  })
})
