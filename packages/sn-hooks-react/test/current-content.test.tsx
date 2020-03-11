import { Repository } from '@sensenet/client-core'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { RepositoryContext } from '../src/context'
import { CurrentContentProvider } from '../src/context/current-content'

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
    repo.load = args => {
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
})
