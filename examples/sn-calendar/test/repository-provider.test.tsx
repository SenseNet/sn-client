import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { RepositoryProvider } from '../src/context/repository-provider'

describe('Repository Provider', () => {
  it('Repository Provider snapshot', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<RepositoryProvider />)
    })

    expect(wrapper).toMatchSnapshot()
  })
})
