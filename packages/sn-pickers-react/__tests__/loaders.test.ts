import { defaultLoadItemsODataOptions, loadItems } from '../src/ListPicker/loaders'

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
    await loadItems({ repository, path: '', itemsODataOptions: mockOdataOptions } as any)
    expect(repository.loadCollection).toBeCalledWith({ oDataOptions: mockOdataOptions, path: '' })
  })
})
