import {
  defaultLoadItemsODataOptions,
  defaultLoadParentODataOptions,
  loadItems,
  loadParent,
} from '../src/ListPicker/loaders'

const repository = {
  loadCollection: jest.fn(() => {
    return { d: {} }
  }),
  load: jest.fn(() => {
    return { d: {} }
  }),
}

const mockOdataOptions = {
  select: ['DisplayName'],
  filter: "isOf('Image')",
  metadata: 'no',
  orderby: 'DisplayName',
}

describe('loadItems function', () => {
  it('should load with default OData options', async () => {
    await loadItems({ repository, path: '' } as any)
    expect(repository.loadCollection).toBeCalledWith({ oDataOptions: defaultLoadItemsODataOptions, path: '' })
  })

  it('should load with provided OData options', async () => {
    await loadItems({ repository, path: '', oDataOptions: mockOdataOptions } as any)
    expect(repository.loadCollection).toBeCalledWith({ oDataOptions: mockOdataOptions, path: '' })
  })
})

describe('loadParent function', () => {
  it('should load with default OData options', async () => {
    await loadParent({ repository, id: 1 } as any)
    expect(repository.load).toBeCalledWith({ oDataOptions: defaultLoadParentODataOptions, idOrPath: 1 })
  })
  it('should not load when id is undefined', async () => {
    jest.clearAllMocks()
    await loadParent({ repository } as any)
    expect(repository.load).toBeCalledTimes(0)
  })
  it('should load whwith provided OData options', async () => {
    await loadParent({ repository, id: 1, oDataOptions: mockOdataOptions } as any)
    expect(repository.load).toBeCalledWith({
      oDataOptions: { ...mockOdataOptions, expand: ['Workspace'] },
      idOrPath: 1,
    })
  })
})
