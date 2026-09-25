import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { LocalLoginAppearance, LocalMfaChallenge, LocalRepositorySession } from '../../services/local-authentication'
import background from './assets/local-auth-background.png'
import logo from './assets/local-auth-logo.svg'
import './local-login-page.css'

const color = (value: unknown, fallback: string) =>
  typeof value === 'string' && /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(value) ? value : fallback
const imageUrl = (value?: string) => {
  try {
    const url = new URL(value || '')
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : undefined
  } catch {
    return undefined
  }
}
export const loginAppearance = (appearance: LocalLoginAppearance = {}) =>
  ({
    '--local-background': color(appearance.backgroundColor, '#d4f3fa'),
    '--local-brand': color(appearance.brandColor, '#38a9cb'),
    '--local-button': color(appearance.buttonColor, '#38a9cb'),
    '--local-button-text': color(appearance.buttonTextColor, '#ffffff'),
    '--local-text': color(appearance.textColor, '#343b43'),
    '--local-panel': color(appearance.panelColor, '#ffffff'),
    backgroundImage: `url(${JSON.stringify(imageUrl(appearance.backgroundImageUrl) || background)})`,
  } as React.CSSProperties)

export function LocalLoginPage({
  repositoryUrl,
  session,
  loading,
  error,
  resetToken,
  onAuthenticated,
  onChooseRepository,
}: {
  repositoryUrl: string
  session?: LocalRepositorySession
  loading: boolean
  error: string
  resetToken?: string
  onAuthenticated: () => Promise<void>
  onChooseRepository: () => void
}) {
  const mounted = useRef(true)
  useEffect(
    () => () => {
      mounted.current = false
    },
    [],
  )
  const [mode, setMode] = useState<'login' | 'mfa' | 'forgot' | 'reset'>(resetToken ? 'reset' : 'login')
  const [challenge, setChallenge] = useState<LocalMfaChallenge>()
  const [working, setWorking] = useState(false)
  const [failure, setFailure] = useState('')
  const [notice, setNotice] = useState('')
  const appearance = session?.endpoints.appearance
  const title = typeof appearance?.title === 'string' ? appearance.title.slice(0, 120) : 'Login to sensenet'
  const busy = working || loading
  const disabled = busy || !session
  const minimum = session?.endpoints.minimumPasswordLength || 12
  const changeMode = (next: typeof mode) => {
    setMode(next)
    setChallenge(undefined)
    setFailure('')
    setNotice('')
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!session || busy) return
    const form = event.currentTarget
    const data = new FormData(form)
    const value = (name: string) => String(data.get(name) || '')
    if (mode === 'reset' && value('password') !== value('confirmPassword')) {
      setFailure('The passwords do not match.')
      return
    }
    setWorking(true)
    setFailure('')
    setNotice('')
    // Passwords and authenticator codes are never kept in React state or browser storage.
    form.reset()
    try {
      if (mode === 'login') {
        const next = await session.beginLogin(value('username'), value('password'), value('twoFactorCode'))
        if (next) {
          setChallenge(next)
          setMode('mfa')
        } else {
          await onAuthenticated()
        }
      } else if (mode === 'mfa' && challenge) {
        await session.completeMfa(challenge.challengeToken, value('twoFactorCode'))
        setChallenge(undefined)
        await onAuthenticated()
      } else if (mode === 'forgot') {
        await session.forgotPassword(value('email'))
        setNotice('If this email belongs to an eligible account, a password reset link will be sent. Check your inbox.')
      } else if (mode === 'reset' && resetToken) {
        await session.resetPassword(resetToken, value('password'))
        setMode('login')
        setNotice('Your password has been changed. Sign in with your new password.')
      }
    } catch {
      if (mounted.current)
        setFailure(
          mode === 'login'
            ? 'Sign-in failed. Check your username and password.'
            : mode === 'mfa'
            ? 'The code is invalid or verification has expired. Try again, or return to login.'
            : mode === 'reset'
            ? 'The reset link is invalid or expired, or the password does not meet the policy. Request a new link.'
            : 'The request could not be completed. Please try again later.',
        )
    } finally {
      if (mounted.current) setWorking(false)
    }
  }

  const heading =
    mode === 'mfa'
      ? 'Verify your identity'
      : mode === 'forgot'
      ? 'Forgot your password?'
      : mode === 'reset'
      ? 'Choose a new password'
      : title
  const action =
    mode === 'mfa' ? 'Verify' : mode === 'forgot' ? 'Send reset link' : mode === 'reset' ? 'Change password' : 'Login'

  return (
    <main className="local-auth-screen" style={loginAppearance(appearance)}>
      <section className="local-auth-card" aria-labelledby="local-auth-title" aria-busy={busy}>
        <aside className="local-auth-brand">
          <img src={imageUrl(appearance?.logoUrl) || logo} alt="Repository logo" referrerPolicy="no-referrer" />
        </aside>
        <div className="local-auth-content">
          <h1 id="local-auth-title">{heading}</h1>
          <p className="local-auth-repository">{repositoryUrl}</p>
          {(failure || error) && (
            <p className="local-auth-error" role="alert">
              {failure || error}
            </p>
          )}
          {notice && (
            <p className="local-auth-notice" role="status">
              {notice}
            </p>
          )}
          {loading && <p role="status">Connecting to repository…</p>}
          <form key={mode} onSubmit={submit}>
            <fieldset disabled={disabled}>
              {mode === 'login' && (
                <>
                  <label htmlFor="local-username">Username</label>
                  <input
                    id="local-username"
                    name="username"
                    autoComplete="username"
                    required
                    maxLength={256}
                    autoFocus
                  />
                  <label htmlFor="local-password">Password</label>
                  <input
                    id="local-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    maxLength={4096}
                  />
                  {!session?.endpoints.mfa && (
                    <>
                      <label htmlFor="local-code">Verification code (if required)</label>
                      <input id="local-code" name="twoFactorCode" autoComplete="one-time-code" maxLength={64} />
                    </>
                  )}
                  {session?.endpoints.forgotPassword && (
                    <div className="local-auth-forgot">
                      <button type="button" className="local-auth-link" onClick={() => changeMode('forgot')}>
                        Forgot password?
                      </button>
                    </div>
                  )}
                </>
              )}
              {mode === 'mfa' && (
                <>
                  {challenge?.manualEntryKey ? (
                    <div className="local-auth-enrollment">
                      <p>Add this account to your authenticator app, then enter its current code.</p>
                      {challenge.qrCodeSetupImageUrl?.startsWith('data:image/png;base64,') && (
                        <img src={challenge.qrCodeSetupImageUrl} alt="Scan with your authenticator app" />
                      )}
                      <p>Manual setup key</p>
                      <code>{challenge.manualEntryKey}</code>
                    </div>
                  ) : (
                    <p>Enter the code from your authenticator app.</p>
                  )}
                  <label htmlFor="local-code">Verification code</label>
                  <input
                    id="local-code"
                    name="twoFactorCode"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    required
                    maxLength={64}
                    autoFocus
                  />
                </>
              )}
              {mode === 'forgot' && (
                <>
                  <p>Enter the email address associated with your repository account.</p>
                  <label htmlFor="local-email">Email address</label>
                  <input
                    id="local-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    autoFocus
                  />
                </>
              )}
              {mode === 'reset' && (
                <>
                  <p>Use at least {minimum} characters. Multi-factor authentication remains enabled.</p>
                  <label htmlFor="local-password">New password</label>
                  <input
                    id="local-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={minimum}
                    maxLength={4096}
                    required
                    autoFocus
                  />
                  <label htmlFor="local-confirm">Confirm new password</label>
                  <input
                    id="local-confirm"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={minimum}
                    maxLength={4096}
                    required
                  />
                </>
              )}
              <div className="local-auth-actions">
                {mode === 'login' ? (
                  <button type="button" className="local-auth-link" onClick={onChooseRepository}>
                    Choose another repository
                  </button>
                ) : (
                  <button type="button" className="local-auth-link" onClick={() => changeMode('login')}>
                    Back to login
                  </button>
                )}
                <button type="submit" className="local-auth-submit">
                  {busy ? 'Please wait…' : action}
                </button>
              </div>
              {mode === 'reset' && failure && session?.endpoints.forgotPassword && (
                <button type="button" className="local-auth-link" onClick={() => changeMode('forgot')}>
                  Request a new reset link
                </button>
              )}
            </fieldset>
          </form>
          {!session && !loading && (
            <button type="button" className="local-auth-link" onClick={onChooseRepository}>
              Choose another repository
            </button>
          )}
        </div>
      </section>
      <div className="local-auth-footer">
        <img src={logo} alt="sensenet" />
      </div>
    </main>
  )
}
