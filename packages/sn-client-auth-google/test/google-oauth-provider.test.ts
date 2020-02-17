import { JwtService, LoginResponse } from '@sensenet/authentication-jwt'
import { Repository } from '@sensenet/client-core'
import { sleepAsync } from '@sensenet/client-utils'
import { JSDOM } from 'jsdom'
import { addGoogleAuth } from '../src'
import { GoogleOauthProvider } from '../src/GoogleOauthProvider'

describe('GoogleOauthProvider', () => {
  const exampleOrigin = 'http://example.origin.com'
  let repo: Repository
  let jwtService: JwtService
  let oauth: GoogleOauthProvider
  let dom: JSDOM

  beforeEach(() => {
    dom = new JSDOM('', { url: exampleOrigin, referrer: exampleOrigin })
    repo = new Repository(
      {
        repositoryUrl: exampleOrigin,
      },
      async () => ({ ok: true, json: async () => ({ access: '', refresh: '' } as LoginResponse) } as any),
    )
    jwtService = new JwtService(repo)
    repo.authentication = jwtService
    oauth = addGoogleAuth(jwtService, { clientId: '', redirectUri: '/' }, dom.window as any)
  })

  afterEach(() => {
    repo.dispose()
  })

  describe('#getGoogleLoginUrl()', () => {
    it('returns a valid Google Login URl', () => {
      const otherOauth = addGoogleAuth(jwtService, {
        clientId: 'TestclientId',
        redirectUri: 'https://test-redirect-uri',
        scope: ['profile', 'email'],
      })
      const expectedUrl =
        'https://accounts.google.com/o/oauth2/v2/auth?response_type=id_token&redirect_uri=https%3A%2F%2Ftest-redirect-uri&scope=profile%20email&client_id=TestclientId&nonce='
      expect(otherOauth.getGoogleLoginUrl().indexOf(expectedUrl)).toBe(0)
    })

    it('should return the correct id_token', () => {
      const l = { hash: '#id_token=testToken&prop=foo&bar=baz' } as Location
      const token = oauth.getGoogleTokenFromUri(l)
      expect(token).toBe('testToken')
    })
  })

  describe('#GetGoogleTokenFromUri()', () => {
    it('should return null if no id_token provided', () => {
      const l = { hash: '#access_token=testToken&prop=foo&bar=baz' } as Location
      const token = oauth.getGoogleTokenFromUri(l)
      expect(token).toBe(null)
    })
  })

  describe('#login()', () => {
    it('should trigger an Ajax request', async () => {
      let sentArgs: any[] = []
      repo['fetch'] = async (...args: any[]) => {
        sentArgs = args
        return {
          ok: true,
          json: async () => ({ access: '', refresh: '' } as LoginResponse),
        } as any
      }
      await oauth.login('testGoogleToken')

      expect(sentArgs[0]).toBe('http://example.origin.com/sn-oauth/login?provider=google')
      expect(sentArgs[1].body).toBe('{"token":"testGoogleToken"}')
    })
    it('should throw on Ajax error', done => {
      // ToDo
      repo.fetch = async () => {
        return {
          ok: false,
          json: async () => ':(',
        } as any
      }

      oauth
        .login('testGoogleToken')
        .then(() => {
          done('Error should be thrown')
        })
        .catch(() => {
          done()
        })
    })

    it('should trigger the GetToken() without specified Token', (done: jest.DoneCallback) => {
      oauth.getToken = () => done() as any
      oauth.login()
    })
  })

  describe('#GetToken()', () => {
    it('should try to retrieve the token silently', (done: jest.DoneCallback) => {
      oauth['getTokenSilent'] = () => done() as any
      oauth.login()
    })

    it('should try to get the token with prompt when failed to retrieve it silently', (done: jest.DoneCallback) => {
      oauth['getTokenSilent'] = () => {
        throw Error(')')
      }
      oauth['getTokenFromPrompt'] = () => done() as any
      oauth.login()
    })
  })
  describe('#getTokenSilent()', () => {
    it('should throw if an iframe is already created', (done: jest.DoneCallback) => {
      oauth['iframe'] = {} as any
      oauth['getTokenSilent']('')
        .then(() => {
          done('Should have fail')
        })
        .catch(err => {
          expect(err.message).toBe('Getting token already in progress')
          done()
        })
    })
    it('should fail when unable to get the Token from the URL', (done: jest.DoneCallback) => {
      oauth['getTokenSilent'](oauth.getGoogleLoginUrl())
        .then(() => {
          done('Should have failed')
        })
        .catch(err => {
          expect(err.message).toBe('Token not found')
          done()
        })
      ;(oauth['iframe'] as any).onload({} as any)
    })

    it('should fail when no Token found', (done: jest.DoneCallback) => {
      oauth['getTokenSilent'](oauth.getGoogleLoginUrl())
        .then(() => {
          done('Should have failed')
        })
        .catch(err => {
          expect(err.message).toBe('Token not found')
          done()
        })
      ;(oauth['iframe'] as any).onload({} as any)
    })

    it('getTokenSilent() should return token and clean up iframe', (done: jest.DoneCallback) => {
      oauth['getTokenSilent'](oauth.getGoogleLoginUrl())
        .then(() => {
          expect(oauth['iframe']).toBe(undefined)
          expect(dom.window.document.querySelectorAll('iframe').length).toBe(0)
          done()
        })
        .catch(err => done(err))
      ;(oauth['iframe'] as any).onload({
        srcElement: {
          contentDocument: {
            location: {
              hash: '#id_token=testToken&foo=bar&param2=prop2',
            },
          },
        },
      } as any)
    })
  })

  describe('#getTokenFromPrompt()', () => {
    it('should return the valid token object and close popup', (done: jest.DoneCallback) => {
      const popupLocationHref = oauth.getGoogleLoginUrl()
      ;(oauth['windowInstance'] as any).open = () => ({
        window: { location: { href: 'https://localhost:8080#access_token=invalid' } },
      })
      setTimeout(() => {
        ;(oauth['popup'] as any) = { window: { location: { href: 'https://localhost:8080#access_token=invalid' } } }
      }, 100)

      setTimeout(() => {
        ;(oauth['popup'] as any) = {
          window: { location: { href: 'https://localhost:8080#id_token=testIdToken', hash: '#id_token=testIdToken' } },
        }
      }, 200)
      oauth['getTokenFromPrompt'](popupLocationHref)
        .then(token => {
          expect(token).toBe('testIdToken')
          expect(dom.window.document.querySelectorAll('iframe').length).toBe(0)
          done()
        })
        .catch(err => done(err))
    })

    it('should fail when a popup has been closed before getting the token', (done: jest.DoneCallback) => {
      ;(oauth['windowInstance'] as any).open = () => ({
        window: { location: { href: 'https://localhost:8080#access_token=invalid' } },
      })
      const popupLocationHref = oauth.getGoogleLoginUrl()
      sleepAsync(250).then(() => {
        ;(oauth['popup'] as any) = null
      })
      oauth['getTokenFromPrompt'](popupLocationHref)
        .then(() => {
          done('should have failed')
        })
        .catch(() => {
          done()
        })
    })
  })
})
