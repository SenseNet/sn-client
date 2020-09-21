import { Repository } from '@sensenet/client-core'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { RepositoryContext } from '../src/context'
import { CurrentContentContext, CurrentContentProvider } from '../src/context/current-content'

describe('CurrentContent', () => {
  it('matches snapshot', () => {
    const p = shallow(<CurrentContentProvider idOrPath={1} />)
    expect(p).toMatchSnapshot()
  })

  it('can be mounted', async () => {
    await act(async () => {
      const repo = new Repository(
        {},
        async () =>
          ({
            ok: true,
            json: async () => ({
              d: {
                /** */
                Id: 1,
              },
            }),
          } as any),
      )
      mount(
        <RepositoryContext.Provider value={repo}>
          <CurrentContentProvider idOrPath={1} />
        </RepositoryContext.Provider>,
      )
    })
  })

  it('should load the parent when deleted', async () => {
    const mockContent = { Id: 1, Name: 'Teszt1', Path: '/Root/Content/IT' }
    let currentRepoLoadArgs: any
    const repo = new Repository()
    repo.load = (args) => {
      currentRepoLoadArgs = args
      return { d: mockContent } as any
    }
    repo.delete = () => {
      return { d: { results: [mockContent], errors: [] } } as any
    }
    await act(async () => {
      mount(
        <RepositoryContext.Provider value={repo}>
          <CurrentContentProvider idOrPath={mockContent.Path} />
        </RepositoryContext.Provider>,
      )
    })
    expect(currentRepoLoadArgs.idOrPath).toBe(mockContent.Path)
    await act(async () => {
      repo.delete({ idOrPath: mockContent.Path })
    })
    expect(currentRepoLoadArgs.idOrPath).toBe('Root/Content')
  })

  it('should load the parent on batch delete', async () => {
    const mockContent = { Id: 1, Name: 'Teszt1', Path: '/Root/Content/IT' }
    const mockContent2 = { Id: 2, Name: 'Teszt2', Path: '/Root/Content/Marketing' }
    let currentRepoLoadArgs: any
    const repo = new Repository()
    repo.load = (args) => {
      currentRepoLoadArgs = args
      return { d: mockContent } as any
    }
    repo.delete = () => {
      return { d: { results: [mockContent, mockContent2], errors: [] } } as any
    }
    await act(async () => {
      mount(
        <RepositoryContext.Provider value={repo}>
          <CurrentContentProvider idOrPath={mockContent2.Path} />
        </RepositoryContext.Provider>,
      )
    })
    expect(currentRepoLoadArgs.idOrPath).toBe(mockContent2.Path)
    await act(async () => {
      repo.delete({ idOrPath: [mockContent.Id, mockContent2.Id] })
    })
    expect(currentRepoLoadArgs.idOrPath).toBe('Root/Content')
  })

  it('should reload on modify', async () => {
    const mockContent = { Id: 1, Name: 'Teszt1', Path: '/Root/Content/IT' }

    const repo = new Repository()
    repo.load = () => {
      return { d: { ...mockContent } } as any
    }
    repo.patch = (patchOptions: any) => {
      mockContent.Name = patchOptions.content.Name
      return { d: mockContent, errors: [] } as any
    }
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <CurrentContentProvider idOrPath={mockContent.Path} onContentLoaded={jest.fn}>
            <CurrentContentContext.Consumer>{(value) => <div>Name: {value.Name}</div>}</CurrentContentContext.Consumer>
          </CurrentContentProvider>
        </RepositoryContext.Provider>,
      )
    })
    expect(wrapper.update().find('div').text()).toBe('Name: Teszt1')
    await act(async () => {
      repo.patch({
        idOrPath: mockContent.Path,
        content: { Name: 'Teszt2', Id: 1 },
      })
    })

    expect(wrapper.update().find('div').text()).toBe('Name: Teszt2')
  })
})
