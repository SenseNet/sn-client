import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Snackbar } from '@material-ui/core'
import { RepositoryContext } from '@sensenet/hooks-react'
import { App } from '../src/app'
import { SimpleAppBar } from '../src/components/SimpleAppBar'
import { AdvancedGridList } from '../src/components/AdvancedGridList'
import { images } from './mocks/images'

describe('Get Images from repository', () => {
  it('getselectedImage with result', async () => {
    const repository = {
      loadCollection: () => {
        return { d: { results: images } }
      },
      configuration: {
        repositoryUrl: 'url',
      },
    }
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repository as any}>
          <App />
        </RepositoryContext.Provider>,
      )
    })
    expect(
      wrapper
        .update()
        .find(AdvancedGridList)
        .prop('imgList'),
    ).not.toBe([])
  })
  it('getselectedImage without result', async () => {
    const repository = {
      loadCollection: () => {
        return { d: { results: [] } }
      },
      configuration: {
        repositoryUrl: 'url',
      },
    }
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repository as any}>
          <App />
        </RepositoryContext.Provider>,
      )
      expect(
        wrapper
          .update()
          .find(AdvancedGridList)
          .prop('imgList'),
      ).toStrictEqual([])
    })
  })
  it('Reload Images', async () => {
    const repository = {
      loadCollection: jest.fn(() => {
        return { d: { results: images } }
      }),
      configuration: {
        repositoryUrl: 'url',
      },
    }
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repository as any}>
          <App />
        </RepositoryContext.Provider>,
      )
    })
    expect(repository.loadCollection).toBeCalledTimes(1)
    await act(async () => {
      wrapper.find(SimpleAppBar).prop('uploadsetdata')()
    })
    expect(repository.loadCollection).toBeCalledTimes(2)
  })
})
describe('Notification Control', () => {
  it('should show notification', async () => {
    const repository = {
      loadCollection: () => {
        return { d: { results: [] } }
      },
      configuration: {
        repositoryUrl: 'url',
      },
    }
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repository as any}>
          <App />
        </RepositoryContext.Provider>,
      )
      await act(async () => {
        wrapper
          .update()
          .find(AdvancedGridList)
          .prop('notificationControll')(true)
      })
      expect(
        wrapper
          .update()
          .find(Snackbar)
          .prop('open'),
      ).toBe(true)
    })
  })
  it('should close notification', async () => {
    const repository = {
      loadCollection: () => {
        return { d: { results: [] } }
      },
      configuration: {
        repositoryUrl: 'url',
      },
    }
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repository as any}>
          <App />
        </RepositoryContext.Provider>,
      )
      await act(async () => {
        wrapper
          .update()
          .find(Snackbar)
          .prop('onClose')()
      })
      expect(
        wrapper
          .update()
          .find(Snackbar)
          .prop('open'),
      ).toBe(false)
    })
  })
})
