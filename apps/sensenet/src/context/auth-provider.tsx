import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'
import { ConstantContent } from '@sensenet/client-core'
import { User } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { User as SNUser, useSnAuth } from '@sensenet/sn-auth-react'
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

export interface AuthContextModel {
  user?: User | SNUser | null
  userPath?: string | null
  login: () => any
  logout: () => any
}

const AuthContext = createContext<AuthContextModel>({
  user: null,
  userPath: null,
  login: () => {},
  logout: () => {},
})

export function ISAuthProvider({ children }: PropsWithChildren<{}>) {
  const repository = useRepository()
  const { oidcUser, login, logout } = useOidcAuthentication()
  const logger = useLogger('current-user-provider')
  const [currentUser, setCurrentUser] = useState<User>()

  useEffect(() => {
    const ac = new AbortController()
    async function getUser() {
      if (!oidcUser || !oidcUser.profile.sub) {
        return
      }

      try {
        const result = await repository.load<User>({
          idOrPath: oidcUser.profile.sub,
          oDataOptions: {
            select: 'all',
            expand: ['AllRoles'] as any,
          },
          requestInit: {
            signal: ac.signal,
          },
        })
        setCurrentUser(result.d)
      } catch (error) {
        if (!ac.signal.aborted) {
          logger.debug({ message: `Couldn't load current user`, data: error })
          setCurrentUser(ConstantContent.VISITOR_USER)
        }
      }
    }
    getUser()
    return () => ac.abort()
  }, [logger, oidcUser, repository])

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        userPath: currentUser?.Path,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export function SNAuthProvider({ children }: PropsWithChildren<{}>) {
  const { user, externalLogin: login, logout } = useSnAuth()

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider')
  }
  return context
}
