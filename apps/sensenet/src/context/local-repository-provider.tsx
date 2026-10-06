import { Repository } from '@sensenet/client-core'
import { User } from '@sensenet/default-content-types'
import { RepositoryContext } from '@sensenet/hooks-react'
import React, { useEffect, useRef, useState } from 'react'
import { LocalLoginPage } from '../components/login/local-login-page'
import LoginPage from '../components/login/login-page'
import {
  discoverAuthentication,
  LocalRepositorySession,
  localSelectedRepository,
} from '../services/local-authentication'
import { AuthContext } from './auth-provider'

export function LocalRepositoryProvider({
  url,
  selectRepository,
  initialResetToken,
  onResetComplete,
  children,
}: {
  url: string
  initialResetToken?: string
  onResetComplete?: () => void
  selectRepository: (url: string) => void
  children: React.ReactNode
}) {
  const repoUrl = url || sessionStorage.getItem(localSelectedRepository) || ''
  const [session, setSession] = useState<LocalRepositorySession>()
  const [repository, setRepository] = useState<Repository>()
  const [user, setUser] = useState<User>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [chooseRepository, setChooseRepository] = useState(!repoUrl)
  const mounted = useRef(true)
  const [resetToken, setResetToken] = useState(() => {
    if (initialResetToken) return initialResetToken
    const location = new URL(window.location.href)
    const token = new URLSearchParams(location.hash.slice(1)).get('localResetToken')
    if (token) {
      location.hash = ''
      window.history.replaceState(window.history.state, '', location.href)
    }
    return token && /^[A-Za-z0-9_-]{64}$/.test(token) ? token : undefined
  })

  // Initial entry decides whether to restore a session; consuming the token must not
  // restart discovery or replace the active session object.
  const enteredWithReset = useRef(!!resetToken).current
  const finishReset = () => {
    if (resetToken) {
      setResetToken(undefined)
      onResetComplete?.()
    }
  }

  const loadUser = async (current: LocalRepositorySession) => {
    const repo = new Repository(
      {
        repositoryUrl: current.repositoryUrl,
        token: current.accessToken,
        requiredSelect: [
          'Id',
          'Path',
          'Name',
          'Type',
          'DisplayName',
          'Icon',
          'IsFile',
          'IsFolder',
          'ParentId',
          'Version',
          'Binary',
          'Avatar',
        ],
      },
      current.fetch,
    )
    current.onChange = () => {
      repo.configuration.token = current.accessToken
      if (!current.hasSession && mounted.current) {
        setUser(undefined)
        setRepository(undefined)
        setError('Your session has ended. Sign in again.')
      }
    }
    const response = await current.fetch(`${current.repositoryUrl}/odata.svc/('Root')/GetCurrentUser`)
    if (!response.ok) throw new Error('Could not load your account.')
    const result = await response.json()
    if (String(result.d?.Id) !== current.subject) throw new Error('Could not identify your account.')
    await repo.reloadSchema()
    if (mounted.current) {
      setRepository(repo)
      setUser(result.d)
    }
  }

  useEffect(() => {
    mounted.current = true
    let active = true
    const abort = new AbortController()
    setUser(undefined)
    setRepository(undefined)
    setSession(undefined)
    setError('')
    if (!repoUrl)
      return () => {
        mounted.current = false
      }
    setBusy(true)
    ;(async () => {
      try {
        const capabilities = await discoverAuthentication(repoUrl, abort.signal)
        if (!capabilities?.local)
          throw new Error('Internal authentication is unavailable for this repository or network.')
        if (!active) return
        const current = new LocalRepositorySession(repoUrl, capabilities.local)
        setSession(current)
        if (current.hasSession && !enteredWithReset) await loadUser(current)
      } catch {
        if (active) setError('Internal authentication is unavailable or your session has ended.')
      } finally {
        if (active) setBusy(false)
      }
    })()
    return () => {
      active = false
      mounted.current = false
      abort.abort()
    }
  }, [repoUrl, enteredWithReset])

  if (chooseRepository) {
    return <LoginPage isLoginInProgress={false} handleSubmit={selectRepository} />
  }

  if (user && repository && session) {
    return (
      <RepositoryContext.Provider value={repository}>
        <AuthContext.Provider
          value={{
            user,
            userPath: user.Path,
            login: () => {
              setUser(undefined)
              setRepository(undefined)
            },
            logout: async () => {
              try {
                await session.logout()
              } catch {
                if (mounted.current) setError('Signed out locally. Server revocation could not be confirmed.')
              } finally {
                if (mounted.current) {
                  setUser(undefined)
                  setRepository(undefined)
                }
              }
            },
          }}>
          {children}
        </AuthContext.Provider>
      </RepositoryContext.Provider>
    )
  }

  return (
    <LocalLoginPage
      repositoryUrl={repoUrl}
      session={session}
      loading={busy}
      error={error}
      resetToken={resetToken}
      onResetComplete={finishReset}
      onAuthenticated={async () => {
        if (session) {
          setError('')
          await loadUser(session)
          finishReset()
        }
      }}
      onChooseRepository={() => setChooseRepository(true)}
    />
  )
}
