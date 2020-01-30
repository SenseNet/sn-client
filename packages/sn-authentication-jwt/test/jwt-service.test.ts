import { LoginState, Repository } from '@sensenet/client-core'
import { JwtService } from '../src'
import { LoginResponse } from '../src/LoginResponse'
import { RefreshResponse } from '../src/RefreshResponse'
import { MockTokenFactory } from './__Mocks__/MockTokenFactory'

export const jwtServiceTests = describe('JwtService', () => {
  let repo: Repository
  let jwtService: JwtService
  beforeEach(() => {
    repo = new Repository({}, async () => ({} as any))
    jwtService = new JwtService(repo)
  })

  it('can be constructed', () => {
    expect(jwtService).toBeInstanceOf(JwtService)
  })

  it('can be disposed with oauth providers', () => {
    const dispose = jest.fn()
    jwtService.oauthProviders.add({ dispose } as any)
    jwtService.dispose()
    expect(dispose).toBeCalled()
  })

  describe('#checkForUpdate()', () => {
    it('should return false if not token is set', async () => {
      const hasRefreshed = await jwtService.checkForUpdate()
      expect(hasRefreshed).toBe(false)
    })

    it('should return false if AccessToken is valid', async () => {
      jwtService.currentUser.setValue({ Domain: 'BuiltIn', LoginName: 'Mock' } as any)
      jwtService['tokenStore'].AccessToken = MockTokenFactory.CreateValid()
      const hasRefreshed = await jwtService.checkForUpdate()
      expect(hasRefreshed).toBe(false)
    })

    it('should return true and make a request if AccessToken is invalid but RefreshToken is valid', async () => {
      // ToDo: fixme
      // jwtService['updateUser'] = async () => {
      //   /**  */
      // }
      // await sleepAsync(10)
      // jwtService.currentUser.setValue({ Domain: 'BuiltIn', LoginName: 'Mock' } as any)
      // jwtService['tokenStore'].RefreshToken = MockTokenFactory.CreateExpired()
      // jwtService['tokenStore'].RefreshToken = MockTokenFactory.CreateValid()
      // repo['fetchMethod'] = async () => {
      //   return {
      //     ok: true,
      //     json: async () =>
      //       ({
      //         access: MockTokenFactory.CreateValid().toString(),
      //         refresh: MockTokenFactory.CreateValid().toString(),
      //       } as LoginResponse),
      //   }
      // }
      // const hasRefreshed = await jwtService.checkForUpdate()
      // expect(hasRefreshed).toBe(true)
    })
  })

  describe('#execTokenRefresh()', () => {
    it('Should set the state to Authenticated in case of success', async () => {
      jwtService['tokenStore'].RefreshToken = MockTokenFactory.CreateValid()
      jwtService.currentUser.setValue({ Domain: 'BuiltIn', LoginName: 'Mock' } as any)
      repo['fetchMethod'] = async () => {
        return {
          ok: true,
          json: async () =>
            ({
              access: MockTokenFactory.CreateValid().toString(),
              refresh: MockTokenFactory.CreateValid().toString(),
            } as RefreshResponse),
        }
      }
      const hasRefreshed = await jwtService['execTokenRefresh']()
      expect(hasRefreshed).toBe(true)
      expect(jwtService.state.getValue()).toBe(LoginState.Authenticated)
    })

    it('Should set the state to Unauthenticated in case of request failure', async () => {
      jwtService['tokenStore'].RefreshToken = MockTokenFactory.CreateValid()
      jwtService.currentUser.setValue({ Domain: 'BuiltIn', LoginName: 'Mock' } as any)
      repo['fetchMethod'] = async () => {
        return {
          ok: false,
          json: async () => ({}),
        }
      }
      const hasRefreshed = await jwtService['execTokenRefresh']()
      expect(hasRefreshed).toBe(true)
      expect(jwtService.state.getValue()).toBe(LoginState.Unauthenticated)
    })
  })

  describe('#handleAuthenticationResponse()', () => {
    it('should update the tokens', () => {
      const at = MockTokenFactory.CreateValid().toString()
      const rt = MockTokenFactory.CreateNotValidYet().toString()
      jwtService.handleAuthenticationResponse({
        access: at,
        refresh: rt,
      })
      expect(jwtService['tokenStore'].AccessToken.toString()).toBe(at)
      expect(jwtService['tokenStore'].RefreshToken.toString()).toBe(rt)
    })

    it('should return true if the access token is valid', () => {
      const at = MockTokenFactory.CreateValid().toString()
      const rt = MockTokenFactory.CreateNotValidYet().toString()
      const result = jwtService.handleAuthenticationResponse({
        access: at,
        refresh: rt,
      })
      expect(result).toBe(true)
    })

    it('should return false if the access token is not valid', () => {
      const at = MockTokenFactory.CreateExpired().toString()
      const rt = MockTokenFactory.CreateNotValidYet().toString()
      const result = jwtService.handleAuthenticationResponse({
        access: at,
        refresh: rt,
      })
      expect(result).toBe(false)
    })
  })

  describe('#login()', () => {
    it('should update status to authenticated if response is ok', async () => {
      repo['fetchMethod'] = () => {
        return {
          ok: true,
          json: () =>
            ({
              access: MockTokenFactory.CreateValid().toString(),
              refresh: MockTokenFactory.CreateValid().toString(),
              d: { results: [] },
            } as LoginResponse),
        }
      }
      const success = await jwtService.login('user', 'pass')
      expect(success).toBe(true)
      expect(jwtService.state.getValue()).toBe(LoginState.Authenticated)
    })

    it('should update status to unauthenticated if response is not ok', async () => {
      repo['fetchMethod'] = async () => {
        return {
          ok: false,
          json: async () => ({}),
        }
      }
      const success = await jwtService.login('user', 'pass')
      expect(success).toBe(false)
      expect(jwtService.state.getValue()).toBe(LoginState.Unauthenticated)
    })
  })

  describe('#logout()', () => {
    it('should invalidate the tokens', async () => {
      jwtService.handleAuthenticationResponse({
        access: MockTokenFactory.CreateValid().toString(),
        refresh: MockTokenFactory.CreateValid().toString(),
      })
      const success = await jwtService.logout()
      expect(success).toBe(true)
      expect(jwtService['tokenStore'].AccessToken.IsValid()).toBe(false)
      expect(jwtService['tokenStore'].RefreshToken.IsValid()).toBe(false)
    })
  })
})
