import React, { createContext, ReactNode, useState, useEffect } from 'react'
import { User } from '../models/user'
import { AuthRoutes } from './auth-routes'
import { SnAuthConfiguration } from '../models/sn-auth-configuration'
import { changePasswordApiCall, convertAuthTokenApiCall, forgotPasswordApiCall, getUserDetailsApiCall, loginApiCall, logoutApiCall, multiFactorApiCall, passwordRecoveryApiCall, refreshTokenApiCall, validateTokenApiCall } from '../server-actions'
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
import { LoginRequest } from '../models/login-request'
import { LoginResponse } from '../models/login-response'
import { MultiFactorLoginRequest } from '../models/multi-factor-login-request'

export interface AuthenticationContextState {
  isLoading: boolean
  user: User | null
  login: (loginRequest: LoginRequest) => Promise<LoginResponse>
  externalLogin: () => void
  multiFactorLogin: (multiFactorRequest: MultiFactorLoginRequest) => void
  forgotPassword: (email: string) => Promise<void>,
  passwordRecovery: (token: string, password: string) => Promise<void>,
  changePassword: (password: string) => Promise<void>
  logout: () => void
  accessToken: string | null
  error: string | null
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
  const [isRefreshingToken, setIsRefreshingToken] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

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
    const validateAndRefreshToken = async () => {
      setIsLoading(true);
      try {
        if (accessToken) {
          let accessTokenLocal = accessToken
          const isValid = await validateTokenApiCall(props.authServerUrl, accessTokenLocal);

          if (!isValid) {
            const response = await refreshAccessToken();
            if (!response?.accessTokenResponse)
              throw new Error()

            accessTokenLocal = response.accessTokenResponse
          }

          const userDetails = await getUserDetailsApiCall(props.authServerUrl, accessTokenLocal);
          setUser(userDetails);
        }

        setIsLoading(false);
      } catch (err) {
        setError('Failed to validate or refresh token');
        setIsLoading(false);
      }
    };

    validateAndRefreshToken();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const accToken = getAccessToken()
      if (accToken && isTokenAboutToExpire(accToken) && !isRefreshingToken) {
        setIsRefreshingToken(true)
      }
    }, TOKEN_EXPIRY_THRESHOLD);

    return () => clearInterval(intervalId);
  }, [isRefreshingToken]) 

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await refreshAccessToken();
        if (!response?.accessTokenResponse)
          throw new Error()

        const userDetails = await getUserDetailsApiCall(props.authServerUrl, response.accessTokenResponse);
        setUser(userDetails);
      } catch (err) {
        setError('Failed to refresh access token');
        logoutLocal();
      }
      setIsRefreshingToken(false)
    }

    if (isRefreshingToken)
      refreshToken()
  }, [isRefreshingToken, props.authServerUrl])

  const externalLogin = () => {
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
        const { accessToken: accessTokenResponse, refreshToken: refreshTokenResponse } = await convertAuthTokenApiCall(
          props.authServerUrl,
          authToken,
        )
        setAccessAndRefreshToken(accessTokenResponse, refreshTokenResponse)

        const user = await getUserDetailsApiCall(props.authServerUrl, accessTokenResponse)
        setUser(user)
        setUserDetailsStorage(user)
      }
    } catch (e) {
      setError(e);
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
        setAccessAndRefreshToken(accessTokenResponse, refreshTokenResponse)

        return { accessTokenResponse, refreshTokenResponse }
      } catch (e) {
        console.error(e)
        setError("Failed to refresh token")
        logoutLocal()
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

  const login = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await loginApiCall(props.authServerUrl, loginRequest)

      if (!response.multiFactorRequired && response.accessToken && response.refreshToken) {
        setAccessAndRefreshToken(response.accessToken, response.refreshToken)

        const user = await getUserDetailsApiCall(props.authServerUrl, response.accessToken)
        setUser(user)
        setUserDetailsStorage(user)

        return response
      }
      else {
        throw new Error()
      }
    }
    catch (e) {
      console.log("Error during login.")

      removeAccessToken()
      removeRefreshToken()

      throw e;
    }
  }

  const multiFactorLogin = async (multiFactorRequest: MultiFactorLoginRequest): Promise<LoginResponse> => {
    try {
      const response = await multiFactorApiCall(props.authServerUrl, multiFactorRequest)

      if (response.accessToken && response.refreshToken) {
        setAccessAndRefreshToken(response.accessToken, response.refreshToken)

        return response;
      }
      else {
        throw new Error();
      }
    }
    catch (e) {
      console.log("Error during multi-factor validation.")

      removeAccessToken()
      removeRefreshToken()

      throw e;
    }
  }

  const forgotPassword = async (email: string) => {
    await forgotPasswordApiCall(props.authServerUrl, { email })
  }

  const passwordRecovery = async (token: string, password: string) => {
    await passwordRecoveryApiCall(props.authServerUrl, { token, password })
  }

  const changePassword = async (password: string) => {
    if (accessToken)
      changePasswordApiCall(props.authServerUrl, accessToken, { password })
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

  const setAccessAndRefreshToken = (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)

    setAccessTokenStorage(accessToken)
    setRefreshTokenStorage(refreshToken)
  }

  return (
    <AuthenticationContext.Provider
      value={{
        accessToken,
        user,
        login,
        externalLogin,
        logout,
        forgotPassword,
        passwordRecovery,
        changePassword,
        multiFactorLogin,
        isLoading,
        error
      }}>
      <AuthRoutes callbackUri={props.snAuthConfiguration.callbackUri} currentPath={path}>
        {props.children}
      </AuthRoutes>
    </AuthenticationContext.Provider>
  )
}
