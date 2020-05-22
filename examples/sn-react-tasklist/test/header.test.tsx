/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/camelcase */
import React, { PropsWithChildren } from 'react'
import { IconButton } from '@material-ui/core'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { AppProviders } from '../src/components/app-providers'
import HeaderPanel from '../src/components/header'

const logout = jest.fn()
jest.mock('@sensenet/authentication-oidc-react', () => ({
  useOidcAuthentication: () => ({ oidcUser: { access_token: 'token', profile: { name: 'Joe' } }, logout }),
  AuthenticationProvider: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
}))

describe('Header', () => {
  it('Logout function', async () => {
    let wrapper: any

    await act(async () => {
      wrapper = mount(
        <AppProviders>
          <HeaderPanel />
        </AppProviders>,
      )
    })

    wrapper.update().find(IconButton).simulate('click')
    expect(logout).toBeCalled()
  })
})
