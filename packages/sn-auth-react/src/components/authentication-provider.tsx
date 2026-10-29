import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react'
import { clearPendingExternalLogin, consumeExternalLogin, prepareExternalLogin } from '../external-login'
import { LoginRequest } from '../models/login-request'
import { LoginResponse } from '../models/login-response'
import { MultiFactorLoginRequest } from '../models/multi-factor-login-request'
import { SnAuthConfiguration } from '../models/sn-auth-configuration'
import { User } from '../models/user'
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
import { isTokenAboutToExpire } from '../token-helpers'
import { AuthRoutes } from './auth-routes'

export interface AuthenticationContextState {
  isLoading: boolean
  user?: User
  login: (loginRequest: LoginRequest) => Promise<LoginResponse>
  externalLogin: () => Promise<void>
  multiFactorLogin: (multiFactorRequest: MultiFactorLoginRequest) => Promise<LoginResponse>
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
  storageKeyPrefix?: string
  eventCallbacks?: {
    onInitialized?: () => void
    onNoInitialization?: () => void
    onLogout?: () => void
    onLogoutError?: (error: unknown) => void
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
  const [path, setPath] = useState(window.location.pathname)
  const state = useRef(authState)
  const mounted = useRef(true)
  const generation = useRef(0)
  const refreshing = useRef<number>()
  const { storageKeyPrefix, repoUrl, authServerUrl } = props
  const { callbackUri } = props.snAuthConfiguration
  const target = { repoUrl, authServerUrl, callbackUri }
  const callbacks = useRef(props.eventCallbacks)
  callbacks.current = props.eventCallbacks

  const active = (version: number) => mounted.current && generation.current === version
  const publish = (next: AuthState) => {
    state.current = next
    if (mounted.current) setState(next)
  }
  const clearSession = (error?: string) => {
    generation.current++
    removeAccessToken(storageKeyPrefix)
    removeRefreshToken(storageKeyPrefix)
    clearPendingExternalLogin(target)
    publish({ isLoading: false, ...(error ? { error } : {}) })
  }
  const saveSession = (version: number, accessToken: string, refreshToken: string, user: User) => {
    if (!active(version)) return
    setAccessTokenStorage(accessToken, storageKeyPrefix)
    setRefreshTokenStorage(refreshToken, storageKeyPrefix)
    publish({ accessToken, refreshToken, user, isLoading: false })
  }
  const beginSignIn = () => {
    const version = ++generation.current
    publish({ isLoading: true })
    return version
  }

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      generation.current++
    }
  }, [repoUrl, authServerUrl, storageKeyPrefix])

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname)
    window.addEventListener('popstate', updatePath)
    return () => window.removeEventListener('popstate', updatePath)
  }, [])

  useEffect(() => {
    if (path !== callbackUri) return
    const version = beginSignIn()
    ;(async () => {
      try {
        const query = new URLSearchParams(window.location.search)
        const authToken = query.get('auth_code')
        if (!authToken) throw new Error('The sign-in response contains no authorization code. Start sign-in again.')
        const verifier = consumeExternalLogin(target, query.get('state'))
        const response = await convertAuthTokenApiCall(authServerUrl, authToken, verifier)
        if (!active(version)) return
        const user = await getUserDetailsApiCall(repoUrl, response.accessToken)
        saveSession(version, response.accessToken, response.refreshToken, user)
      } catch (error) {
        if (active(version)) {
          publish({
            error: error instanceof Error ? error.message : 'Failed to complete sign-in. Start sign-in again.',
            isLoading: false,
          })
        }
      } finally {
        if (active(version)) {
          window.history.replaceState({}, '', '/')
          setPath('/')
        }
      }
    })()
  }, [path, callbackUri, repoUrl, authServerUrl, storageKeyPrefix])

  useEffect(() => {
    if (path === callbackUri) return
    const version = generation.current
    publish({ isLoading: true })
    ;(async () => {
      try {
        let accessToken = getAccessToken(storageKeyPrefix)
        let refreshToken = getRefreshToken(storageKeyPrefix)
        if (!accessToken || !refreshToken) {
          publish({ isLoading: false })
          callbacks.current?.onNoInitialization?.()
          return
        }
        const valid =
          !isTokenAboutToExpire(accessToken, TOKEN_EXPIRY_THRESHOLD) &&
          (await validateTokenApiCall(authServerUrl, accessToken))
        if (!active(version)) return
        if (!valid) {
          const refreshed = await refreshTokenApiCall(authServerUrl, refreshToken)
          if (!active(version)) return
          ;({ accessToken, refreshToken } = refreshed)
        }
        const user = await getUserDetailsApiCall(repoUrl, accessToken)
        if (!active(version)) return
        saveSession(version, accessToken, refreshToken, user)
        callbacks.current?.onInitialized?.()
      } catch {
        if (active(version)) clearSession('Failed to validate or refresh token. Sign in again.')
      }
    })()
  }, [repoUrl, authServerUrl, storageKeyPrefix])

  useEffect(() => {
    const interval = setInterval(async () => {
      const { current } = state
      const version = generation.current
      if (
        !mounted.current ||
        !current.accessToken ||
        !current.refreshToken ||
        current.isLoading ||
        current.error ||
        refreshing.current === version ||
        !isTokenAboutToExpire(current.accessToken, TOKEN_EXPIRY_THRESHOLD)
      )
        return
      refreshing.current = version
      publish({ ...current, isLoading: true })
      try {
        const response = await refreshTokenApiCall(authServerUrl, current.refreshToken)
        if (!active(version)) return
        const user = await getUserDetailsApiCall(repoUrl, response.accessToken)
        saveSession(version, response.accessToken, response.refreshToken, user)
      } catch {
        if (active(version)) clearSession('Failed to refresh token. Sign in again.')
      } finally {
        if (refreshing.current === version) refreshing.current = undefined
      }
    }, TOKEN_EXPIRY_THRESHOLD)
    return () => clearInterval(interval)
  }, [repoUrl, authServerUrl, storageKeyPrefix])

  const externalLogin = async () => {
    const version = beginSignIn()
    try {
      const destination = await prepareExternalLogin(target, () => active(version))
      if (active(version)) window.location.replace(destination)
    } catch (error) {
      if (active(version)) clearSession('Could not start secure sign-in. Start sign-in again.')
      throw error
    }
  }

  const logout = () => {
    const accessToken = state.current.accessToken || getAccessToken(storageKeyPrefix)
    const onLogoutError = callbacks.current?.onLogoutError
    clearSession()
    window.history.replaceState({}, '', '/')
    setPath('/')
    callbacks.current?.onLogout?.()
    if (accessToken && authServerUrl) {
      logoutApiCall(authServerUrl, accessToken).catch((error) => {
        console.error('Server logout could not be confirmed.')
        onLogoutError?.(error)
      })
    }
  }

  const login = async (request: LoginRequest): Promise<LoginResponse> => {
    const version = beginSignIn()
    try {
      const response = await loginApiCall(authServerUrl, { ...request, siteUrl: repoUrl })
      if (!active(version)) throw new Error('Sign-in was cancelled.')
      if (!response.multiFactorRequired && response.accessToken && response.refreshToken) {
        const user = await getUserDetailsApiCall(repoUrl, response.accessToken)
        if (!active(version)) throw new Error('Sign-in was cancelled.')
        saveSession(version, response.accessToken, response.refreshToken, user)
      } else publish({ isLoading: false })
      return response
    } catch (error) {
      if (active(version)) clearSession('Error during login. Sign in again.')
      throw error
    }
  }

  const multiFactorLogin = async (request: MultiFactorLoginRequest): Promise<LoginResponse> => {
    const version = beginSignIn()
    try {
      const response = await multiFactorApiCall(authServerUrl, { ...request, siteUrl: repoUrl })
      if (!active(version)) throw new Error('Sign-in was cancelled.')
      if (!response.accessToken || !response.refreshToken) throw new Error('Incomplete sign-in response.')
      const user = await getUserDetailsApiCall(repoUrl, response.accessToken)
      if (!active(version)) throw new Error('Sign-in was cancelled.')
      saveSession(version, response.accessToken, response.refreshToken, user)
      return response
    } catch (error) {
      if (active(version)) clearSession('Error during multi-factor validation. Sign in again.')
      throw error
    }
  }

  const forgotPassword = async (email: string) => forgotPasswordApiCall(authServerUrl, { email })
  const passwordRecovery = async (token: string, password: string) =>
    passwordRecoveryApiCall(authServerUrl, { token, password })
  const changePassword = async (password: string) => {
    if (state.current.accessToken) await changePasswordApiCall(authServerUrl, state.current.accessToken, { password })
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
      <AuthRoutes callbackUri={callbackUri} currentPath={path}>
        {props.children}
      </AuthRoutes>
    </AuthenticationContext.Provider>
  )
}
