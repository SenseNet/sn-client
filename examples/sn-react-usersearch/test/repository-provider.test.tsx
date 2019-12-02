import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { RepositoryProvider } from '../src/context/repository-provider'
import { TestUserList } from './_mocks_/test_contents'

describe('Repository Provider', () => {
  it('Repository Provider snapshot', async () => {
    let wrapper: any
    window.fetch = function fetchMethod() {
      return Promise.resolve({ d: TestUserList } as any)
    }
    await act(async () => {
      wrapper = mount(<RepositoryProvider />)
    })

    expect(wrapper).toMatchSnapshot()
  })
})
