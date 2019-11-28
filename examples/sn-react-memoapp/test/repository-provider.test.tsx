import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { RepositoryProvider } from '../src/context/repository-provider'

describe('The repository provider instance', () => {
  it('should renders correctly', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<RepositoryProvider />)
    })

    expect(wrapper).toMatchSnapshot()
  })
})
