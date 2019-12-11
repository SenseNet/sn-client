import { mount, shallow } from 'enzyme'
import React from 'react'
import { IconButton } from '@material-ui/core'
import { act } from 'react-dom/test-utils'
import { RepositoryContext } from '@sensenet/hooks-react'
import HeaderPanel from '../src/components/header'

describe('Header', () => {
  it('Matches snapshot', () => {
    const l = shallow(<HeaderPanel />)
    expect(l).toMatchSnapshot()
  })
  it('Logout function', async () => {
    const logoutfn = jest.fn()
    const getValue = () => {
      return { DisplayName: 'Test man' } as any
    }
    const subscribe = () => {
      return { DisplayName: 'Test man', Id: 2, Domain: 'Test man' } as any
    }
    const repo = { authentication: { logout: logoutfn, currentUser: { getValue, subscribe } } }
    let wrapper: any

    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <HeaderPanel />
        </RepositoryContext.Provider>,
      )
    })

    wrapper
      .update()
      .find(IconButton)
      .simulate('click')
    expect(logoutfn).toBeCalled()
  })
})
