import React, { useContext } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'
import { AuthContext } from '../src/context/auth-provider'
import { LocalRepositoryProvider } from '../src/context/local-repository-provider'
import { localSessionKey } from '../src/services/local-authentication'

jest.mock('@sensenet/client-core', () => ({
  Repository: class {
    configuration: any
    constructor(config: any) {
      this.configuration = config
    }
    reloadSchema() {
      return Promise.resolve()
    }
  },
}))
jest.mock('@sensenet/hooks-react', () => ({ RepositoryContext: jest.requireActual('react').createContext(null) }))
jest.mock('../src/context/auth-provider', () => ({ AuthContext: jest.requireActual('react').createContext(null) }))
jest.mock(
  '../src/components/login/login-page',
  () =>
    function RepositoryPicker() {
      return <div>Repository picker</div>
    },
)
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
}
const tokens = {
  accessToken: `h.${btoa(JSON.stringify({ sub: '42', iss: repo, exp: Math.floor(Date.now() / 1000) + 300 }))}.s`,
  refreshToken: 'r'.repeat(64),
  expiresIn: 300,
}
const response = (body: any) => new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } })
const Probe = () => {
  const auth = useContext(AuthContext)
  return (
    <>
      <div>Signed in as {auth.user?.Name}</div>
      <button onClick={auth.logout}>Logout</button>
    </>
  )
}
let element: HTMLDivElement
const previousFetch = global.fetch
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
  global.fetch = previousFetch
})
const mount = (initialResetToken?: string) =>
  act(async () => {
    render(
      <LocalRepositoryProvider url={repo} initialResetToken={initialResetToken} selectRepository={() => {}}>
        <Probe />
      </LocalRepositoryProvider>,
      element,
    )
  })

it('submits explicit credentials/MFA, loads the repository identity and revokes only its local session', async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({ mode: 'InternalOnly', local: endpoints }))
    .mockResolvedValueOnce(response(tokens))
    .mockResolvedValueOnce(response({ d: { Id: 42, Name: 'admin', Path: '/Root/IMS/Public/admin' } }))
    .mockResolvedValueOnce(new Response(null, { status: 204 }))
  global.fetch = request
  await mount()
  ;(element.querySelector('[name=username]') as HTMLInputElement).value = 'admin'
  ;(element.querySelector('[name=password]') as HTMLInputElement).value = 'secret'
  ;(element.querySelector('[name=twoFactorCode]') as HTMLInputElement).value = '123456'
  await act(async () => {
    Simulate.submit(element.querySelector('form')!)
  })
  expect(JSON.parse(request.mock.calls[1][1].body)).toEqual({
    username: 'admin',
    password: 'secret',
    twoFactorCode: '123456',
  })
  expect(element.textContent).toContain('Signed in as admin')
  expect(sessionStorage.getItem(localSessionKey(repo, repo))).not.toContain('secret')
  await act(async () => {
    element.querySelector('button')!.click()
  })
  expect(request.mock.calls[3][0]).toBe(repo + endpoints.logout)
  expect(element.textContent).not.toContain('Signed in as admin')
  expect(sessionStorage.getItem(localSessionKey(repo, repo))).toBeNull()
})

it('never renders authenticated content when a restored token resolves to Visitor', async () => {
  sessionStorage.setItem(localSessionKey(repo, repo), JSON.stringify(tokens))
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce(response({ mode: 'InternalOnly', local: endpoints }))
    .mockResolvedValueOnce(response({ d: { Id: 6, Name: 'Visitor' } }))
  await mount()
  expect(element.textContent).not.toContain('Signed in as')
  expect(element.querySelector('[role=alert]')).not.toBeNull()
})

it('consumes the recovery fragment without restoring an existing session or storing its token', async () => {
  const resetToken = 'x'.repeat(64)
  window.history.replaceState({}, '', `/?repoUrl=${encodeURIComponent(repo)}#localResetToken=${resetToken}`)
  sessionStorage.setItem(localSessionKey(repo, repo), JSON.stringify(tokens))
  const request = jest.fn().mockResolvedValueOnce(
    response({
      mode: 'InternalOnly',
      local: { ...endpoints, resetPassword: '/authentication/local/reset-password' },
    }),
  )
  global.fetch = request
  await mount()
  expect(window.location.hash).toBe('')
  expect(window.location.search).toContain('repoUrl=')
  expect(element.textContent).toContain('Choose a new password')
  expect(element.textContent).not.toContain('Signed in as')
  expect(request).toHaveBeenCalledTimes(1)
  expect(JSON.stringify(sessionStorage)).not.toContain(resetToken)
  window.history.replaceState({}, '', '/')
})

it.each(['fragment', 'prop'])('returns to login after reset, sign-in and logout from a %s token', async (entry) => {
  const resetToken = 'r'.repeat(64)
  window.history.replaceState({}, '', entry === 'fragment' ? `/#localResetToken=${resetToken}` : '/')
  const request = jest
    .fn()
    .mockResolvedValueOnce(
      response({
        mode: 'InternalOnly',
        local: { ...endpoints, resetPassword: '/authentication/local/reset-password' },
      }),
    )
    .mockResolvedValueOnce(new Response(null, { status: 204 }))
    .mockResolvedValueOnce(response(tokens))
    .mockResolvedValueOnce(response({ d: { Id: 42, Name: 'admin', Path: '/Root/IMS/Public/admin' } }))
    .mockResolvedValueOnce(new Response(null, { status: 204 }))
  global.fetch = request
  await mount(entry === 'prop' ? resetToken : undefined)
  expect(element.textContent).toContain('Choose a new password')
  ;(element.querySelector('[name=password]') as HTMLInputElement).value = 'new-long-password'
  ;(element.querySelector('[name=confirmPassword]') as HTMLInputElement).value = 'new-long-password'
  await act(async () => {
    Simulate.submit(element.querySelector('form')!)
  })
  expect(element.textContent).toContain('Your password has been changed')
  ;(element.querySelector('[name=username]') as HTMLInputElement).value = 'admin'
  ;(element.querySelector('[name=password]') as HTMLInputElement).value = 'new-long-password'
  await act(async () => {
    Simulate.submit(element.querySelector('form')!)
  })
  expect(element.textContent).toContain('Signed in as admin')
  await act(async () => {
    element.querySelector('button')!.click()
  })
  expect(element.querySelector('[name=username]')).not.toBeNull()
  expect(element.querySelector('[name=confirmPassword]')).toBeNull()
  expect(element.textContent).not.toContain('Choose a new password')
  expect(request).toHaveBeenCalledTimes(5)
  expect(window.location.hash).toBe('')
})

it.each(['success', 'failure'])('keeps a new login when an older pending logout finishes with %s', async (outcome) => {
  let finishLogout!: (value: Response) => void
  let failLogout!: (error: Error) => void
  sessionStorage.setItem(localSessionKey(repo, repo), JSON.stringify(tokens))
  const freshTokens = { ...tokens, refreshToken: 'n'.repeat(64) }
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({ mode: 'InternalOnly', local: endpoints }))
    .mockResolvedValueOnce(response({ d: { Id: 42, Name: 'admin', Path: '/Root/IMS/Public/admin' } }))
    .mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          finishLogout = resolve
          failLogout = reject
        }),
    )
    .mockResolvedValueOnce(response(freshTokens))
    .mockResolvedValueOnce(response({ d: { Id: 42, Name: 'admin', Path: '/Root/IMS/Public/admin' } }))
  global.fetch = request
  await mount()
  await act(async () => {
    element.querySelector('button')!.click()
  })
  expect(element.querySelector('[name=username]')).not.toBeNull()
  ;(element.querySelector('[name=username]') as HTMLInputElement).value = 'admin'
  ;(element.querySelector('[name=password]') as HTMLInputElement).value = 'password'
  await act(async () => {
    Simulate.submit(element.querySelector('form')!)
  })
  expect(element.textContent).toContain('Signed in as admin')
  await act(async () => {
    if (outcome === 'success') finishLogout(new Response(null, { status: 204 }))
    else failLogout(new Error('Old logout failed'))
  })
  expect(element.textContent).toContain('Signed in as admin')
  expect(element.querySelector('[role=alert]')).toBeNull()
  expect(JSON.parse(sessionStorage.getItem(localSessionKey(repo, repo))!)).toEqual(freshTokens)
})

it('does not replace a new repository identity when an old provider load finishes', async () => {
  const secondRepo = 'https://second.example'
  const secondTokens = {
    ...tokens,
    accessToken: `h.${btoa(
      JSON.stringify({ sub: '43', iss: secondRepo, exp: Math.floor(Date.now() / 1000) + 300 }),
    )}.s`,
  }
  sessionStorage.setItem(localSessionKey(repo, repo), JSON.stringify(tokens))
  sessionStorage.setItem(localSessionKey(secondRepo, secondRepo), JSON.stringify(secondTokens))
  let finishFirstUser!: (value: Response) => void
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({ mode: 'InternalOnly', local: endpoints }))
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishFirstUser = resolve
        }),
    )
    .mockResolvedValueOnce(response({ mode: 'InternalOnly', local: { ...endpoints, issuer: secondRepo } }))
    .mockResolvedValueOnce(response({ d: { Id: 43, Name: 'second-admin', Path: '/Root/IMS/Public/second-admin' } }))
  global.fetch = request
  await mount()
  await act(async () => {
    render(
      <LocalRepositoryProvider url={secondRepo} selectRepository={() => {}}>
        <Probe />
      </LocalRepositoryProvider>,
      element,
    )
  })
  expect(element.textContent).toContain('Signed in as second-admin')
  await act(async () => {
    finishFirstUser(response({ d: { Id: 42, Name: 'first-admin', Path: '/Root/IMS/Public/first-admin' } }))
  })
  expect(element.textContent).toContain('Signed in as second-admin')
  expect(element.textContent).not.toContain('Signed in as first-admin')
})
