/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/camelcase */
import Button from '@material-ui/core/Button'
import { mount } from 'enzyme'
import React, { PropsWithChildren } from 'react'
import { AppProviders } from '../src/components/app-providers'
import { NavBarComponent } from '../src/components/navbar'

const logout = jest.fn()
jest.mock('@sensenet/authentication-oidc-react', () => ({
  useOidcAuthentication: () => ({ oidcUser: { access_token: 'token' }, logout }),
  AuthenticationProvider: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
}))

const NavBar = () => (
  <AppProviders>
    <NavBarComponent />
  </AppProviders>
)

describe('The navbar instance', () => {
  it('should logout the user correctly', () => {
    const wrapper = mount(<NavBar />)

    wrapper.find(Button).simulate('click')
    expect(logout).toBeCalled()
  })
})
