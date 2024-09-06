import React, { createContext, ReactNode, useState, useEffect } from 'react'
import { User } from '../models/user'
import { AuthRoutes } from './auth-routes'
import { SnAuthConfiguration } from '../models/sn-auth-configuration'
import { convertAuthTokenApiCall, getUserDetailsApiCall, logoutApiCall, refreshTokenApiCall } from '../server-actions'
import {
  getAccessToken,
  getRefreshToken,
  getUserDetails,
  removeAccessToken,
  removeRefreshToken,
  removeUserDetails,
  setAccessToken as setAccessTokenStorage,
  setRefreshToken as setRefreshTokenStorage,
  setUserDetails as setUserDetailsStorage,
} from '../storageHelpers'

export interface AuthenticationContextState {
  isLoading: boolean
  user: User | null
  login: () => void
  logout: () => void
  accessToken: string | null
}

export const AuthenticationContext = createContext<AuthenticationContextState | undefined>(undefined)

export interface AuthenticationProviderProps {
  children: ReactNode
  snAuthConfiguration: SnAuthConfiguration
  repoUrl: string
  authServerUrl: string
}

const TOKEN_EXPIRY_THRESHOLD = 10 * 1000

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to parse JWT', error)
    return null
  }
}

const isTokenAboutToExpire = (token: string | null) => {
  if (!token) return true
  const decoded = parseJwt(token)
  if (!decoded || !decoded.exp) return true

  const expiryTime = decoded.exp * 1000
  const currentTime = Date.now()
  return expiryTime - currentTime < TOKEN_EXPIRY_THRESHOLD
}

export const AuthenticationProvider = (props: AuthenticationProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(getAccessToken())
  const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshToken())
  const [user, setUser] = useState<User | null>(getUserDetails())
  const [path, setPath] = useState<string>(window.location.pathname)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const setNewPath = () => setPath(window.location.pathname)

  useEffect(() => {
    window.addEventListener('popstate', setNewPath, false)
    return () => window.removeEventListener('popstate', setNewPath, false)
  }, [])

  useEffect(() => {
    if (path === props.snAuthConfiguration.callbackUri) {
      convertAuthToken().finally(() => {
        window.location.replace('/')
      })
    }
  }, [path])

  useEffect(() => {
    const checkTokenExpiry = async () => {
      setIsLoading(true)
      if (isTokenAboutToExpire(accessToken)) {
        await refreshAccessToken()
      }

      const intervalId = setInterval(async () => {
        if (isTokenAboutToExpire(accessToken)) {
          await refreshAccessToken()
        }
      }, 5000)

      setIsLoading(false)
      return () => clearInterval(intervalId)
    }

    checkTokenExpiry()
  }, [accessToken, refreshToken])

  const login = () => {
    window.location.replace(
      `${props.authServerUrl}/Login?RedirectUrl=${window.location.origin}&CallbackUri=${props.snAuthConfiguration.callbackUri}`,
    )
  }

  const convertAuthToken = async () => {
    setIsLoading(true)
    const urlParams = new URLSearchParams(window.location.search)
    const authToken = urlParams.get('auth_code')

    try {
      if (authToken) {
        const { accessToken: accessTokenResponse, refreshToken: refreshTokenRepsonse } = await convertAuthTokenApiCall(
          props.authServerUrl,
          authToken,
        )
        setAccessToken(accessTokenResponse)
        setRefreshToken(refreshTokenRepsonse)
        setAccessTokenStorage(accessTokenResponse)
        setRefreshTokenStorage(refreshTokenRepsonse)

        const user = await getUserDetailsApiCall(props.authServerUrl, accessTokenResponse)
        setUser(user)
        setUserDetailsStorage(user)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshAccessToken = async () => {
    setIsLoading(true)
    if (refreshToken) {
      try {
        const { accessToken: accessTokenResponse, refreshToken: refreshTokenResponse } = await refreshTokenApiCall(
          props.authServerUrl,
          refreshToken,
        )
        setAccessToken(accessTokenResponse)
        setRefreshToken(refreshTokenResponse)

        setAccessTokenStorage(accessTokenResponse)
        setRefreshTokenStorage(refreshTokenResponse)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (accessToken && props.authServerUrl)
      logoutApiCall(props.authServerUrl, accessToken)
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          logoutLocal()
        })
    else logoutLocal()
  }

  const logoutLocal = () => {
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)

    removeAccessToken()
    removeRefreshToken()
    removeUserDetails()

    window.location.replace('/')
  }

  return (
    <AuthenticationContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
        isLoading,
      }}>
      <AuthRoutes callbackUri={props.snAuthConfiguration.callbackUri} currentPath={path}>
        {props.children}
      </AuthRoutes>
    </AuthenticationContext.Provider>
  )
}
