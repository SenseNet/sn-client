import React, { useContext } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import {
  AuthenticationContext,
  AuthenticationContextState,
  AuthenticationProvider,
} from '../src/components/authentication-provider'
import { getUserDetailsApiCall, refreshTokenApiCall, validateTokenApiCall } from '../src/server-actions'
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../src/storage-helpers'

jest.mock('../src/server-actions')
jest.mock('../src/components/auth-routes', () => ({ AuthRoutes: ({ children }: any) => children }))
const token = (expiresIn: number) =>
  `header.${window.btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expiresIn }))}.signature`
let state: AuthenticationContextState
const Probe = () => {
  state = useContext(AuthenticationContext)!
  return null
}
let container: HTMLDivElement
const initialize = async () => {
  await act(async () => {
    render(
      <AuthenticationProvider
        repoUrl="https://repo.example.test"
        authServerUrl="https://auth.example.test"
        snAuthConfiguration={{ callbackUri: '/callback' }}>
        <Probe />
      </AuthenticationProvider>,
      container,
    )
  })
}
beforeEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
  container = document.createElement('div')
  document.body.appendChild(container)
  ;(validateTokenApiCall as jest.Mock).mockResolvedValue(true)
  ;(getUserDetailsApiCall as jest.Mock).mockResolvedValue({ Id: 1 })
  ;(refreshTokenApiCall as jest.Mock).mockResolvedValue({ accessToken: token(3600), refreshToken: 'rotated-refresh' })
})
afterEach(() => {
  act(() => {
    unmountComponentAtNode(container)
  })
  container.remove()
  localStorage.clear()
})
it.each([-60, 5])(
  'refreshes a token expiring in %s seconds before making authenticated requests',
  async (expiresIn) => {
    setAccessToken(token(expiresIn))
    setRefreshToken('stored-refresh')
    await initialize()
    expect(validateTokenApiCall).not.toHaveBeenCalled()
    expect(refreshTokenApiCall).toHaveBeenCalledWith('https://auth.example.test', 'stored-refresh')
    expect(getUserDetailsApiCall).toHaveBeenCalledWith('https://repo.example.test', state.accessToken)
    expect(getAccessToken()).toBe(state.accessToken)
    expect(getRefreshToken()).toBe('rotated-refresh')
    expect(state.isLoading).toBe(false)
  },
)
it('still validates an unexpired token on the server', async () => {
  const accessToken = token(3600)
  setAccessToken(accessToken)
  setRefreshToken('stored-refresh')
  await initialize()
  expect(validateTokenApiCall).toHaveBeenCalledWith('https://auth.example.test', accessToken)
  expect(refreshTokenApiCall).not.toHaveBeenCalled()
  expect(state.accessToken).toBe(accessToken)
})
it('refreshes an unexpired token when the server rejects it', async () => {
  setAccessToken(token(3600))
  setRefreshToken('stored-refresh')
  ;(validateTokenApiCall as jest.Mock).mockResolvedValue(false)
  await initialize()
  expect(refreshTokenApiCall).toHaveBeenCalledTimes(1)
  expect(state.user).toEqual({ Id: 1 })
})
it('does not make authenticated requests without stored tokens', async () => {
  await initialize()
  expect(validateTokenApiCall).not.toHaveBeenCalled()
  expect(refreshTokenApiCall).not.toHaveBeenCalled()
  expect(getUserDetailsApiCall).not.toHaveBeenCalled()
  expect(state.isLoading).toBe(false)
})
