/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react/display-name */
import React, { PropsWithChildren } from 'react'
import { Button } from '@material-ui/core'
import { mount } from 'enzyme'
import { App } from '../src/app'
import { AppProviders } from '../src/components/app-providers'

const logout = jest.fn()
jest.mock('@sensenet/authentication-oidc-react', () => ({
  useOidcAuthentication: () => ({ oidcUser: { access_token: 'token', profile: { name: 'Joe' } }, logout }),
  AuthenticationProvider: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
}))

describe('The App component', () => {
  it('should trigger logout on logout button click', () => {
    const wrapper = mount(
      <AppProviders>
        <App />
      </AppProviders>,
    )

    wrapper.find(Button).simulate('click')

    expect(logout).toBeCalled()
  })
})
