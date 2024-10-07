import React, { createContext, ReactNode, useState, useEffect } from 'react'
import { User } from '../models/user'
import { AuthRoutes } from './auth-routes'
import { SnAuthConfiguration } from '../models/sn-auth-configuration'
import {
  changePasswordApiCall,
  convertAuthTokenApiCall,
  forgotPasswordApiCall,
  getUserDetailsApiCall,
  loginApiCall,
  logoutApiCall,
  multiFactorApiCall,
  passwordRecoveryApiCall,
  refreshTokenApiCall,
  validateTokenApiCall,
} from '../server-actions'
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken as setAccessTokenStorage,
  setRefreshToken as setRefreshTokenStorage,
} from '../storage-helpers'
import { LoginRequest } from '../models/login-request'
import { LoginResponse } from '../models/login-response'
import { MultiFactorLoginRequest } from '../models/multi-factor-login-request'
import { isTokenAboutToExpire } from '../token-helpers'

export interface AuthenticationContextState {
  isLoading: boolean
  user?: User
  login: (loginRequest: LoginRequest) => Promise<LoginResponse>
  externalLogin: () => void
  multiFactorLogin: (multiFactorRequest: MultiFactorLoginRequest) => void
  forgotPassword: (email: string) => Promise<void>
  passwordRecovery: (token: string, password: string) => Promise<void>
  changePassword: (password: string) => Promise<void>
  logout: () => void
  accessToken?: string
  error?: string
}

export const AuthenticationContext = createContext<AuthenticationContextState | undefined>(undefined)

export interface AuthenticationProviderProps {
  children: ReactNode
  snAuthConfiguration: SnAuthConfiguration
  repoUrl: string
  authServerUrl: string
  eventCallbacks?: {
    onInitialized?: () => void
    onNoInitialization?: () => void
    onLogout?: () => void
  }
}

export interface AuthState {
  accessToken?: string
  refreshToken?: string
  user?: User
  error?: string
  isLoading: boolean
}

const TOKEN_EXPIRY_THRESHOLD = 10 * 1000

export const AuthenticationProvider = (props: AuthenticationProviderProps) => {
  const [authState, setState] = useState<AuthState>({ isLoading: true })
  const [path, setPath] = useState<string>(window.location.pathname)

  const setNewPath = () => setPath(window.location.pathname)

  useEffect(() => {
    window.addEventListener('popstate', setNewPath, false)
    return () => window.removeEventListener('popstate', setNewPath, false)
  }, [])

  useEffect(() => {
    if (path === props.snAuthConfiguration.callbackUri) {
      convertAuthToken().finally(() => {
        window.history.pushState({}, '', '/')
        setNewPath()
      })
    }
  }, [path])

  useEffect(() => {
    const validateAndRefreshToken = async () => {
      if (path !== props.snAuthConfiguration.callbackUri) {
        setState({ isLoading: true })
        try {
          let accessToken = getAccessToken()
          let refreshToken = getRefreshToken()
          if (accessToken && refreshToken) {
            const isValid = await validateTokenApiCall(props.authServerUrl, accessToken)

            if (!isValid) {
              const response = await refreshAccessToken(refreshToken)
              if (!response?.accessToken) throw new Error()

              accessToken = response.accessToken
              refreshToken = response.refreshToken
              setAccessAndRefreshTokenStorage(accessToken, refreshToken)
            }

            const userDetails = await getUserDetailsApiCall(props.repoUrl, accessToken)
            setState({
              accessToken: accessToken,
              refreshToken: refreshToken,
              user: userDetails,
              isLoading: false,
            })
            props.eventCallbacks?.onInitialized?.()
          } else {
            props.eventCallbacks?.onNoInitialization?.()
            setState({
              isLoading: false,
            })
          }
        } catch (err) {
          setState({
            error: 'Failed to validate or refresh token',
            isLoading: false,
          })
          logoutLocal()
        }
      }
    }

    validateAndRefreshToken()
  }, [])

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (
        authState.accessToken &&
        authState.refreshToken &&
        isTokenAboutToExpire(authState.accessToken, TOKEN_EXPIRY_THRESHOLD) &&
        !authState.isLoading &&
        !authState.error
      ) {
        setState({
          ...authState,
          isLoading: true,
        })
        try {
          const response = await refreshAccessToken(authState.refreshToken)
          if (!response?.accessToken) throw new Error()

          const userDetails = await getUserDetailsApiCall(props.repoUrl, response.accessToken)
          setState({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: userDetails,
            isLoading: false,
          })
          setAccessAndRefreshTokenStorage(response.accessToken, response.refreshToken)
        } catch (err) {
          setState({
            error: 'Failed to refresh token',
            isLoading: false,
          })
          logoutLocal()
        }
      }
    }, TOKEN_EXPIRY_THRESHOLD)

    return () => clearInterval(intervalId)
  }, [authState])

  const externalLogin = () => {
    window.location.replace(
      `${props.authServerUrl}/Login?RedirectUrl=${window.location.origin}&CallbackUri=${props.snAuthConfiguration.callbackUri}`,
    )
  }

  const convertAuthToken = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const authToken = urlParams.get('auth_code')

    setState({
      ...authState,
      isLoading: true,
    })
    try {
      if (authToken) {
        const { accessToken, refreshToken } = await convertAuthTokenApiCall(props.authServerUrl, authToken)

        const user = await getUserDetailsApiCall(props.repoUrl, accessToken)
        setState({
          user,
          accessToken: accessToken,
          refreshToken: refreshToken,
          isLoading: false,
        })
        setAccessAndRefreshTokenStorage(accessToken, refreshToken)
      }
    } catch (e) {
      setState({
        error: 'Failed to convert auth token',
        isLoading: false,
      })
    }
  }

  const refreshAccessToken = async (refToken: string) => {
    if (refToken) {
      try {
        setState({
          ...authState,
          isLoading: true,
        })
        const { accessToken, refreshToken } = await refreshTokenApiCall(props.authServerUrl, refToken)

        return { accessToken, refreshToken }
      } catch (e) {
        console.error(e)
        setState({
          ...authState,
          error: 'Failed to refresh access token',
          isLoading: false,
        })
        logoutLocal()
      }
    }
  }

  const logout = () => {
    if (authState.accessToken && props.authServerUrl)
      logoutApiCall(props.authServerUrl, authState.accessToken)
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          props.eventCallbacks?.onLogout?.()
          logoutLocal()
        })
    else logoutLocal()
  }

  const login = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
    setState({
      ...authState,
      isLoading: true,
    })
    try {
      const response = await loginApiCall(props.authServerUrl, loginRequest)

      if (!response.multiFactorRequired && response.accessToken && response.refreshToken) {
        const user = await getUserDetailsApiCall(props.repoUrl, response.accessToken)
        setState({
          user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isLoading: false,
        })
        setAccessAndRefreshTokenStorage(response.accessToken, response.refreshToken)
      }

      return response
    } catch (e) {
      setState({
        ...authState,
        error: 'Error during login.',
        isLoading: false,
      })
      logoutLocal()

      throw e
    }
  }

  const multiFactorLogin = async (multiFactorRequest: MultiFactorLoginRequest): Promise<LoginResponse> => {
    try {
      setState({
        ...authState,
        isLoading: true,
      })
      const response = await multiFactorApiCall(props.authServerUrl, multiFactorRequest)

      if (response.accessToken && response.refreshToken) {
        const user = await getUserDetailsApiCall(props.repoUrl, response.accessToken)
        setState({
          user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isLoading: false,
        })
        setAccessAndRefreshTokenStorage(response.accessToken, response.refreshToken)

        return response
      } else {
        throw new Error()
      }
    } catch (e) {
      setState({
        ...authState,
        error: 'Error during multi-factor validation.',
      })
      logoutLocal()

      throw e
    }
  }

  const forgotPassword = async (email: string) => {
    await forgotPasswordApiCall(props.authServerUrl, { email })
  }

  const passwordRecovery = async (token: string, password: string) => {
    await passwordRecoveryApiCall(props.authServerUrl, { token, password })
  }

  const changePassword = async (password: string) => {
    if (authState.accessToken) changePasswordApiCall(props.authServerUrl, authState.accessToken, { password })
  }

  const logoutLocal = () => {
    setState({
      ...authState,
      accessToken: undefined,
      user: undefined,
      refreshToken: undefined,
    })

    removeAccessToken()
    removeRefreshToken()

    window.history.pushState({}, '', '/')
  }

  const setAccessAndRefreshTokenStorage = (accessToken: string, refreshToken: string) => {
    setAccessTokenStorage(accessToken)
    setRefreshTokenStorage(refreshToken)
  }

  return (
    <AuthenticationContext.Provider
      value={{
        accessToken: authState.accessToken,
        user: authState.user,
        isLoading: authState.isLoading,
        error: authState.error,
        login,
        externalLogin,
        logout,
        forgotPassword,
        passwordRecovery,
        changePassword,
        multiFactorLogin,
      }}>
      <AuthRoutes callbackUri={props.snAuthConfiguration.callbackUri} currentPath={path}>
        {props.children}
      </AuthRoutes>
    </AuthenticationContext.Provider>
  )
}
