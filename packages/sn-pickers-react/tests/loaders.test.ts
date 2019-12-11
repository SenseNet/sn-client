import { defaultLoadItemsODataOptions, loadItems } from '../src/ListPicker/loaders'
import { mockContent } from './mocks/items'

const repository = {
  loadCollection: jest.fn(() => {
    return {
      d: {
        results: [
          {
            ParentId: 123,
          },
        ],
      },
    }
  }),
  load: jest.fn(() => {
    return { d: {} }
  }),
} as any

const mockOdataOptions = {
  select: ['DisplayName'],
  filter: "isOf('Image')",
  metadata: 'no',
  orderby: 'DisplayName',
}

describe('loadItems function', () => {
  it('should load with default OData options', async () => {
    const abortController = new AbortController()
    await loadItems({ repository, path: '', abortController })
    expect(repository.loadCollection).toBeCalledWith({
      oDataOptions: defaultLoadItemsODataOptions,
      path: '',
      requestInit: { signal: abortController.signal },
    })
  })

  it('should load with provided OData options', async () => {
    const abortController = new AbortController()
    await loadItems({ repository, path: '', itemsODataOptions: mockOdataOptions, abortController } as any)
    expect(repository.loadCollection).toBeCalledWith({
      oDataOptions: mockOdataOptions,
      path: '',
      requestInit: { signal: abortController.signal },
    })
  })

  it('should load with parent when parentId is passed', async () => {
    repository.load = jest.fn(() => {
      return { d: mockContent }
    })
    const items = await loadItems({ repository, path: '', parentId: 123, abortController: new AbortController() })
    expect(repository.load).toBeCalledTimes(1)
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveProperty('isParent', true)
  })

  it('should not load parent when parentId is 0', async () => {
    repository.load = jest.fn(() => {
      return { d: mockContent }
    })
    const items = await loadItems({ repository, path: '', parentId: 0, abortController: new AbortController() })
    expect(repository.load).not.toBeCalled()
    expect(items).toHaveLength(1)
  })

  it('should add root as a parent', async () => {
    repository.load = jest.fn(() => {
      return { d: { ...mockContent, ParentId: 0 } }
    })
    const items = await loadItems({ repository, path: '', abortController: new AbortController() })
    expect(items).toHaveLength(1)
  })

  it('should return with items if parent request fails', async () => {
    repository.load = jest.fn(() => {
      throw new Error('Access denied')
    })
    repository.loadCollection = jest.fn(() => {
      return {
        d: {
          results: [
            {
              ParentId: 123,
            },
            {
              ParentId: 124,
            },
            {
              ParentId: 125,
            },
          ],
        },
      }
    })
    const items = await loadItems({ repository, path: '', abortController: new AbortController() })
    expect(items).toHaveLength(3)
  })
})
