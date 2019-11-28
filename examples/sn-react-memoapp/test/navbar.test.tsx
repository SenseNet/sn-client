import { mount, shallow } from 'enzyme'
import React from 'react'
import Button from '@material-ui/core/Button'
import { RepositoryContext } from '@sensenet/hooks-react'
import { NavBarComponent } from '../src/components/navbar'

describe('The navbar instance', () => {
  it('should renders correctly', () => {
    expect(shallow(<NavBarComponent />)).toMatchSnapshot()
  })

  it('should logout correctly', () => {
    const logoutfn = jest.fn()
    const wrapper = mount(
      <RepositoryContext.Provider value={{ authentication: { logout: logoutfn } } as any}>
        <NavBarComponent />
      </RepositoryContext.Provider>,
    )

    wrapper.find(Button).simulate('click')
    expect(logoutfn).toBeCalled()
  })
})
