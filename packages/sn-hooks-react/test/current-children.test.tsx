import React from 'react'
import { mount, shallow } from 'enzyme'
import { Repository } from '@sensenet/client-core'
import { sleepAsync } from '@sensenet/client-utils'
import { act } from 'react-dom/test-utils'
import { CurrentChildrenContext, CurrentChildrenProvider } from '../src/context/current-children'
import { RepositoryContext } from '../src/context'
import { ErrorBoundary } from './mocks/error-boundry'
import { Repository as MockRepository } from './mocks/repository'

describe('CurrentChildren', () => {
  it('matches snapshot', () => {
    const p = shallow(<CurrentChildrenProvider />)
    expect(p).toMatchSnapshot()
  })

  it('Can be mounted', async () => {
    let resolve: any
    const repo = new Repository(
      {},
      () =>
        ({
          ok: true,
          json: () =>
            new Promise(_resolve => {
              resolve = _resolve
            }),
        } as any),
    )

    const wrapper = mount(
      <RepositoryContext.Provider value={repo}>
        <CurrentChildrenProvider>
          <CurrentChildrenContext.Consumer>
            {value => (value.length ? <div>Id: {value[0].Id}</div> : null)}
          </CurrentChildrenContext.Consumer>
        </CurrentChildrenProvider>
      </RepositoryContext.Provider>,
    )

    await sleepAsync(0)

    await act(async () => {
      resolve({
        d: {
          results: [{ Id: 1 }],
        },
      })
    })

    expect(
      wrapper
        .update()
        .find('div')
        .text(),
    ).toBe('Id: 1')
    expect(wrapper).toMatchSnapshot()
  })

  it("throws error when can't connect", async () => {
    // Don't show console errors when tests runs
    jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    const mock = jest.fn()

    const repo = new Repository(
      {},
      () =>
        ({
          ok: false,
          json: () => {
            return {
              error: {
                message: { value: 'cant connect' },
              },
            }
          },
        } as any),
    )

    await act(async () => {
      mount(
        <ErrorBoundary spy={mock}>
          <RepositoryContext.Provider value={repo}>
            <CurrentChildrenProvider>
              <CurrentChildrenContext.Consumer>
                {value => (value.length ? <div>Id: {value[0].Id}</div> : null)}
              </CurrentChildrenContext.Consumer>
            </CurrentChildrenProvider>
          </RepositoryContext.Provider>
          ,
        </ErrorBoundary>,
      )
      await sleepAsync(0)
    })

    expect(mock).toBeCalledWith('cant connect')
    // Restore console.errors
    jest.restoreAllMocks()
  })

  it('reloads when content changes', async () => {
    const mockRepository = new MockRepository()
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={mockRepository as any}>
          <CurrentChildrenProvider>
            <CurrentChildrenContext.Consumer>
              {value =>
                value.length ? (
                  <div>
                    Id: {value[0].Id}, Name: {value[0].Name}
                  </div>
                ) : null
              }
            </CurrentChildrenContext.Consumer>
          </CurrentChildrenProvider>
        </RepositoryContext.Provider>,
      )
    })

    expect(
      wrapper
        .update()
        .find('div')
        .text(),
    ).toBe('Id: 1, Name: name')

    await act(async () => {
      mockRepository.patch({ Id: 1, Name: 'newName' })
    })

    expect(
      wrapper
        .update()
        .find('div')
        .text(),
    ).toBe('Id: 1, Name: newName')
  })

  it('reloads when new content is created', async () => {
    const mockRepository = new MockRepository()
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={mockRepository as any}>
          <CurrentChildrenProvider>
            <CurrentChildrenContext.Consumer>
              {value =>
                value.length
                  ? value.map(c => (
                      <div key={c.Id}>
                        Id: {c.Id}, Name: {c.Name}
                      </div>
                    ))
                  : null
              }
            </CurrentChildrenContext.Consumer>
          </CurrentChildrenProvider>
        </RepositoryContext.Provider>,
      )
    })

    expect(wrapper.update()).toMatchSnapshot()

    await act(async () => {
      mockRepository.post({ Id: 123, Name: 'something', ParentId: 2, Path: '/Root/something' })
    })

    expect(wrapper.update()).toMatchSnapshot()
  })

  it('reloads when new content is deleted', async () => {
    const mockRepository = new MockRepository()
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={mockRepository as any}>
          <CurrentChildrenProvider>
            <CurrentChildrenContext.Consumer>
              {value =>
                value.length
                  ? value.map(c => (
                      <div key={c.Id}>
                        Id: {c.Id}, Name: {c.Name}
                      </div>
                    ))
                  : null
              }
            </CurrentChildrenContext.Consumer>
          </CurrentChildrenProvider>
        </RepositoryContext.Provider>,
      )
    })

    expect(wrapper.update()).toMatchSnapshot()

    await act(async () => {
      mockRepository.delete({ Id: 1, Path: '/Root/Path' })
    })

    expect(wrapper.update()).toMatchSnapshot()
  })

  it('reloads when new content is uploaded under current content', async () => {
    const mockRepository = new MockRepository()
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={mockRepository as any}>
          <CurrentChildrenProvider>
            <CurrentChildrenContext.Consumer>
              {value =>
                value.length
                  ? value.map(c => (
                      <div key={c.Id}>
                        Id: {c.Id}, Name: {c.Name}
                      </div>
                    ))
                  : null
              }
            </CurrentChildrenContext.Consumer>
          </CurrentChildrenProvider>
        </RepositoryContext.Provider>,
      )
    })

    expect(wrapper.update()).toMatchSnapshot()

    await act(async () => {
      mockRepository.upload.uploadNonChunked()
    })

    expect(wrapper.update()).toMatchSnapshot()
  })
})
