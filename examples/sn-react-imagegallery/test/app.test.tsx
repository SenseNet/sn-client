import { RepositoryContext } from '@sensenet/hooks-react'
import React from 'react'
import { mount, shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { App, Transition } from '../src/app'
import { FullScreenDialog } from '../src/components/FullScreenDialog'
import { emptyimages, images } from './mocks/images'
import moment = require('moment')

describe('App Layout', () => {
  it('Matches snapshot', () => {
    const l = shallow(<App />)
    expect(l).toMatchSnapshot()
  })
  it('matches Transition snapshot', () => {
    const l = shallow(<Transition />)
    expect(l).toMatchSnapshot()
  })
  it('returns the selected image', async () => {
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
    act(() => {
      wrapper.update().find(FullScreenDialog).prop('steppingFunction')(0, true)
    })
    const obj = wrapper.update().find(FullScreenDialog).prop('openedImg')
    expect(obj.imgTitle).toBe(images[0].DisplayName)
    expect(obj.imgPath).toBe(repository.configuration.repositoryUrl + images[0].Path)
    expect(obj.imgAuthorAvatar).toBe(images[0].CreatedBy.Avatar.Url)
    expect(obj.imgDescription).toBe(images[0].Description)
    expect(obj.imgCreationDate).toBe(moment(images[0].CreationDate).format('YYYY-MM-DD HH:mm:ss'))
    expect(obj.imgAuthor).toBe(images[0].CreatedBy.DisplayName)
    expect(obj.imgSize).toBe(`${(images[0].Size / 1024 / 1024).toFixed(2)} MB`)
  })
  it('returns without a result when getSelectedImage is called', async () => {
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
    })
    act(() => {
      wrapper.update().find(FullScreenDialog).prop('steppingFunction')(0, true)
    })
    const obj = wrapper.update().find(FullScreenDialog).prop('openedImg')
    expect(obj.imgTitle).toBe('')
    expect(obj.imgPath).toBe('')
    expect(obj.imgAuthorAvatar).toBe('')
    expect(obj.imgDescription).toBe('')
    expect(obj.imgCreationDate).toBe('')
    expect(obj.imgAuthor).toBe('')
    expect(obj.imgSize).toBe('')
  })

  it('getselectedImage with uncomplete images', async () => {
    const repository = {
      loadCollection: () => {
        return { d: { results: emptyimages } }
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
    act(() => {
      wrapper.update().find(FullScreenDialog).prop('steppingFunction')(0, true)
    })
    const obj = wrapper.update().find(FullScreenDialog).prop('openedImg')
    expect(obj.imgTitle).toBe('')
    expect(obj.imgPath).toBe(repository.configuration.repositoryUrl)
    expect(obj.imgAuthorAvatar).toBe('')
    expect(obj.imgDescription).toBe('')
    expect(obj.imgCreationDate).toBe('Invalid date')
    expect(obj.imgAuthor).toBe('')
    expect(obj.imgSize).toBe('0.00 MB')
  })
})
