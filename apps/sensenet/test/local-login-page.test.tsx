import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'
import { LocalLoginPage, loginAppearance } from '../src/components/login/local-login-page'
import { LocalRepositorySession, localSessionKey } from '../src/services/local-authentication'

jest.mock('../src/services/repository-session', () => ({
  normalizeRepositoryUrl: (url: string) => url.replace(/\/$/, ''),
}))
const repo = 'https://repo.example'
const endpoints = {
  issuer: repo,
  login: '/authentication/local/login',
  refresh: '/authentication/local/refresh',
  logout: '/authentication/local/logout',
  revoke: '/authentication/local/revoke',
  mfa: '/authentication/local/mfa',
  forgotPassword: '/authentication/local/forgot-password',
  resetPassword: '/authentication/local/reset-password',
  appearance: { title: 'Login to Test Repository', buttonColor: '#123456', panelColor: '#fafafa' },
}
const response = (body: any, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const tokens = {
  accessToken: `h.${btoa(JSON.stringify({ sub: '1', iss: repo, exp: Math.floor(Date.now() / 1000) + 300 }))}.s`,
  refreshToken: 'r'.repeat(64),
  expiresIn: 300,
}
let element: HTMLDivElement
beforeEach(() => {
  sessionStorage.clear()
  element = document.createElement('div')
  document.body.appendChild(element)
})
afterEach(() => {
  act(() => {
    unmountComponentAtNode(element)
  })
  element.remove()
})
const fill = (name: string, value: string) => {
  ;(element.querySelector(`[name="${name}"]`) as HTMLInputElement).value = value
}
const submit = () =>
  act(async () => {
    Simulate.submit(element.querySelector('form')!)
  })
const button = (text: string) => Array.from(element.querySelectorAll('button')).find((b) => b.textContent === text)!
const mount = (session: LocalRepositorySession, onAuthenticated = jest.fn(), resetToken?: string) => {
  act(() => {
    render(
      <LocalLoginPage
        repositoryUrl={repo}
        session={session}
        loading={false}
        error=""
        resetToken={resetToken}
        onAuthenticated={onAuthenticated}
        onChooseRepository={jest.fn()}
      />,
      element,
    )
  })
  return onAuthenticated
}

it('renders native controls and repository branding without accepting arbitrary CSS/URLs', () => {
  mount(new LocalRepositorySession(repo, endpoints, jest.fn()))
  expect(element.querySelector('h1')?.textContent).toBe('Login to Test Repository')
  expect(element.querySelector('[class*="Mui"]')).toBeNull()
  expect((element.querySelector('main') as HTMLElement).style.getPropertyValue('--local-button')).toBe('#123456')
  const safe = loginAppearance({
    buttonColor: 'url(https://bad.example)',
    backgroundImageUrl: 'javascript:alert(1)',
  }) as any
  expect(safe['--local-button']).toBe('#38a9cb')
  expect(safe.backgroundImage).not.toContain('javascript:')
})

it('requires a separate MFA step and never stores the password or challenge', async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(
      response({ challengeToken: 'c'.repeat(64), expiresIn: 300, manualEntryKey: 'SETUP-KEY' }, 202),
    )
    .mockResolvedValueOnce(response(tokens))
  const session = new LocalRepositorySession(repo, endpoints, request)
  const authenticated = mount(session)
  fill('username', 'admin')
  fill('password', 'never-store-this')
  await submit()
  expect(element.textContent).toContain('Verify your identity')
  expect(element.textContent).toContain('SETUP-KEY')
  expect(element.querySelector('[name=password]')).toBeNull()
  expect(session.hasSession).toBe(false)
  expect(sessionStorage.getItem(localSessionKey(repo, repo))).toBeNull()
  fill('twoFactorCode', '123456')
  await submit()
  expect(request.mock.calls[1][0]).toBe(repo + endpoints.mfa)
  expect(JSON.parse(request.mock.calls[1][1].body)).toEqual({ challengeToken: 'c'.repeat(64), twoFactorCode: '123456' })
  expect(authenticated).toHaveBeenCalledTimes(1)
  expect(sessionStorage.getItem(localSessionKey(repo, repo))).not.toContain('never-store-this')
  expect(sessionStorage.getItem(localSessionKey(repo, repo))).not.toContain('SETUP-KEY')
})

it('submits forgotten-password requests to the selected repository without a client-selected return URL', async () => {
  const request = jest.fn().mockResolvedValue(response({}, 202))
  mount(new LocalRepositorySession(repo, endpoints, request))
  act(() => {
    button('Forgot password?').click()
  })
  fill('email', 'someone@example.com')
  await submit()
  expect(request.mock.calls[0][0]).toBe(repo + endpoints.forgotPassword)
  expect(JSON.parse(request.mock.calls[0][1].body)).toEqual({ email: 'someone@example.com' })
  expect(element.querySelector('[role=status]')?.textContent).toContain('If this email belongs')
})

it('resets a password without automatic login and requires matching confirmation', async () => {
  const request = jest.fn().mockResolvedValue(new Response(null, { status: 204 }))
  const authenticated = mount(new LocalRepositorySession(repo, endpoints, request), jest.fn(), 't'.repeat(64))
  fill('password', 'new-password-value')
  fill('confirmPassword', 'different-password')
  await submit()
  expect(request).not.toHaveBeenCalled()
  expect(element.querySelector('[role=alert]')?.textContent).toContain('do not match')
  fill('confirmPassword', 'new-password-value')
  await submit()
  expect(request.mock.calls[0][0]).toBe(repo + endpoints.resetPassword)
  expect(element.textContent).toContain('Your password has been changed')
  expect(authenticated).not.toHaveBeenCalled()
  expect(sessionStorage.getItem(localSessionKey(repo, repo))).toBeNull()
})
