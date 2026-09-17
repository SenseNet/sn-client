import { Button, Container, TextField, Typography } from '@material-ui/core'
import { Repository } from '@sensenet/client-core'
import { User } from '@sensenet/default-content-types'
import { RepositoryContext } from '@sensenet/hooks-react'
import React, { useEffect, useRef, useState } from 'react'
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
  children,
}: {
  url: string
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
        if (current.hasSession) await loadUser(current)
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
  }, [repoUrl])

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
    <Container maxWidth="sm" style={{ paddingTop: 64 }}>
      <Typography variant="h4" gutterBottom>
        Internal authentication
      </Typography>
      <Typography paragraph>{repoUrl}</Typography>
      {error && (
        <Typography color="error" role="alert">
          {error}
        </Typography>
      )}
      <form
        onSubmit={async (event) => {
          event.preventDefault()
          if (!session || busy) return
          const form = event.currentTarget
          const data = new FormData(form)
          setBusy(true)
          setError('')
          try {
            await session.login(
              String(data.get('username')),
              String(data.get('password')),
              String(data.get('twoFactorCode') || ''),
            )
            await loadUser(session)
          } catch {
            if (mounted.current)
              setError('Sign-in failed. Check your credentials, verification code and network access.')
          } finally {
            form.reset()
            if (mounted.current) setBusy(false)
          }
        }}>
        <TextField
          name="username"
          label="Username"
          autoComplete="username"
          required
          fullWidth
          margin="normal"
          disabled={busy || !session}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          fullWidth
          margin="normal"
          disabled={busy || !session}
        />
        <TextField
          name="twoFactorCode"
          label="Verification code (if required)"
          autoComplete="one-time-code"
          fullWidth
          margin="normal"
          disabled={busy || !session}
        />
        <Button type="submit" color="primary" variant="contained" disabled={busy || !session}>
          Sign in
        </Button>
        <Button disabled={busy} onClick={() => setChooseRepository(true)}>
          Choose another repository
        </Button>
      </form>
    </Container>
  )
}
