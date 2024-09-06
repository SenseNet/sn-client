import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { AuthenticationProvider, AuthenticationContext } from '../src/components/authentication-provider'
import { AuthRoutes } from '../src/components/auth-routes'
import { SnAuthConfiguration } from '../src/models/sn-auth-configuration'
import { User } from '../src/models/user'
import {
  convertAuthTokenApiCall,
  getUserDetailsApiCall,
  logoutApiCall,
  refreshTokenApiCall,
} from '../src/server-actions'
import {
  getAccessToken,
  getRefreshToken,
  getUserDetails,
  setAccessToken as setAccessTokenStorage,
  setRefreshToken as setRefreshTokenStorage,
  setUserDetails as setUserDetailsStorage,
  removeAccessToken,
  removeRefreshToken,
  removeUserDetails,
} from '../src/storageHelpers'

jest.mock('../src/server-actions', () => ({
  convertAuthTokenApiCall: jest.fn(),
  getUserDetailsApiCall: jest.fn(),
  logoutApiCall: jest.fn(),
  refreshTokenApiCall: jest.fn(),
}))

jest.mock('../src/storageHelpers', () => ({
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
  getUserDetails: jest.fn(),
  setAccessToken: jest.fn(),
  setRefreshToken: jest.fn(),
  setUserDetails: jest.fn(),
  removeAccessToken: jest.fn(),
  removeRefreshToken: jest.fn(),
  removeUserDetails: jest.fn(),
}))

const mockSnAuthConfiguration: SnAuthConfiguration = {
  callbackUri: '/callback',
}

const mockUser: User = {
  Id: 1,
  LoginName: 'testuser',
  FullName: 'testuser',
  DisplayName: 'testuser',
  Name: 'testuser',
  Email: 'testuser',
  Avatar: {
    Url: 'testuser',
  },
  Path: 'testuser',
}

const setup = (children?: React.ReactNode) => {
  render(
    <AuthenticationProvider
      snAuthConfiguration={mockSnAuthConfiguration}
      repoUrl="http://example.com"
      authServerUrl="http://authserver.com">
      {children || <div>Content</div>}
    </AuthenticationProvider>,
  )
}

describe('AuthenticationProvider', () => {
  let originalLocation: Location

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getAccessToken as jest.Mock).mockReturnValue('mockAccessToken')
    ;(getRefreshToken as jest.Mock).mockReturnValue('mockRefreshToken')
    ;(getUserDetails as jest.Mock).mockReturnValue(mockUser)

    originalLocation = window.location

    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...originalLocation,
        replace: jest.fn(),
        pathname: '/',
        search: '',
      },
    })
  })

  afterEach(() => {
    // Restore the original window location
    window.location = originalLocation
  })

  test('renders children correctly', () => {
    setup()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  test('calls login function and redirects to the correct URL', async () => {
    setup(
      <AuthenticationContext.Consumer>
        {(c) => <button onClick={c?.login}>Login</button>}
      </AuthenticationContext.Consumer>,
    )

    await act(() => {
      screen.getByText('Login').click()
    })

    expect(window.location.replace).toHaveBeenCalledWith(
      'http://authserver.com/Login?RedirectUrl=http://localhost&CallbackUri=/callback',
    )
  })

  test('handles logout correctly', async () => {
    setup(
      <AuthenticationContext.Consumer>
        {(c) => <button onClick={c?.logout}>Logout</button>}
      </AuthenticationContext.Consumer>,
    )
    ;(logoutApiCall as jest.Mock).mockResolvedValueOnce(null)

    await act(async () => {
      screen.getByText('Logout').click()
    })

    expect(logoutApiCall).toHaveBeenCalledWith('http://authserver.com', 'mockAccessToken')
    expect(removeAccessToken).toHaveBeenCalled()
    expect(removeRefreshToken).toHaveBeenCalled()
    expect(removeUserDetails).toHaveBeenCalled()
  })

  test('refreshes access token when about to expire', async () => {
    ;(refreshTokenApiCall as jest.Mock).mockResolvedValue({
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
    })

    await act(async () => {
      setup()
    })

    await waitFor(() => {
      expect(refreshTokenApiCall).toHaveBeenCalledWith('http://authserver.com', 'mockRefreshToken')
      expect(setAccessTokenStorage).toHaveBeenCalledWith('newAccessToken')
      expect(setRefreshTokenStorage).toHaveBeenCalledWith('newRefreshToken')
    })
  })

  test('calls convertAuthToken on callback path', async () => {
    // Mock window.location for callback path scenario
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...originalLocation,
        pathname: '/callback',
        search: '?auth_code=testAuthToken',
        replace: jest.fn(),
      },
    })
    ;(convertAuthTokenApiCall as jest.Mock).mockResolvedValue({
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
    })
    ;(getUserDetailsApiCall as jest.Mock).mockResolvedValue(mockUser)

    await act(async () => {
      setup()
    })

    expect(convertAuthTokenApiCall).toHaveBeenCalledWith('http://authserver.com', 'testAuthToken')
    expect(setAccessTokenStorage).toHaveBeenCalledWith('newAccessToken')
    expect(setRefreshTokenStorage).toHaveBeenCalledWith('newRefreshToken')
    expect(setUserDetailsStorage).toHaveBeenCalledWith(mockUser)
    expect(window.location.replace).toHaveBeenCalledWith('/')
  })
})
