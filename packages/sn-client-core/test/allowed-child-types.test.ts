import { ContentType } from '@sensenet/default-content-types'
import { Repository } from '../src/Repository'
import { ODataCollectionResponse } from '../src/Models'

describe('AllowedChildTypes', () => {
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

  describe('#getImplicitAllowedChildTypes()', () => {
    it('should resolve on success', async () => {
      ;(mockResponse as any).ok = true
      mockResponse.json = async () => {
        return {
          d: { results: [], __count: 0 },
        } as ODataCollectionResponse<ContentType>
      }
      const response = await repository.allowedChildTypes.getImplicit({
        idOrPath: 'Root/Sites/Default_Site',
      })
      expect(response.d).toEqual({ results: [], __count: 0 })
    })

    it('should throw on unsuccessful request', (done) => {
      ;(mockResponse as any).ok = false
      ;(mockResponse as any).statusText = ':('
      repository.allowedChildTypes
        .getImplicit({
          idOrPath: 'Root/Sites/Default_Site',
        })
        .then(() => {
          done('Should throw')
        })
        .catch((err) => {
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
      const response = await repository.allowedChildTypes.getExplicit({
        idOrPath: 'Root/Sites/Default_Site',
      })
      expect(response.d).toEqual({ results: [], __count: 0 })
    })

    it('should throw on unsuccessful request', (done) => {
      ;(mockResponse as any).ok = false
      ;(mockResponse as any).statusText = ':('
      repository.allowedChildTypes
        .getExplicit({
          idOrPath: 'Root/Sites/Default_Site',
        })
        .then(() => {
          done('Should throw')
        })
        .catch((err) => {
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
      const response = await repository.allowedChildTypes.get({
        idOrPath: 'Root/Sites/Default_Site',
      })
      expect(response).toEqual({ d: { __count: 0, results: [] } })
    })
    it('should throw on unsuccessful request', (done) => {
      ;(mockResponse as any).ok = false
      ;(mockResponse as any).statusText = ':('
      repository.allowedChildTypes
        .get({
          idOrPath: 'Root/Sites/Default_Site',
        })
        .then(() => {
          done('Should throw')
        })
        .catch((err) => {
          expect(err.message).toBe(':(')
          done()
        })
    })
  })

  it('Should execute add', () => {
    expect(repository.allowedChildTypes.add(1, ['Task'])).toBeInstanceOf(Promise)
  })

  it('Should execute update', () => {
    expect(repository.allowedChildTypes.update(1, ['Task'])).toBeInstanceOf(Promise)
  })

  it('Should execute remove', () => {
    expect(repository.allowedChildTypes.remove(1, ['Task'])).toBeInstanceOf(Promise)
  })

  it('Should execute getFromCTD', () => {
    expect(repository.allowedChildTypes.getFromCTD(1)).toBeInstanceOf(Promise)
  })

  it('Should execute listEmpty', () => {
    expect(repository.allowedChildTypes.listEmpty(1)).toBeInstanceOf(Promise)
  })
})
