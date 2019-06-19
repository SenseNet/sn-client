import 'jest'
import { TokenPersist } from '../src/TokenPersist'
import { TokenStore } from '../src/TokenStore'
import { TokenStoreType } from '../src/TokenStoreType'
import { MockStorage } from './__Mocks__/MockStorage'
import { MockTokenFactory } from './__Mocks__/MockTokenFactory'

describe('TokenStore', () => {
  let documentInstance: Document
  let inMemory: TokenStore
  let sessionCookie: TokenStore
  let expirationCookie: TokenStore
  let sessionStorage: TokenStore
  let localStorage: TokenStore

  beforeEach(() => {
    documentInstance = { cookie: '' } as Document
  })

  describe('Storage initialization', () => {
    it('can be constructed without provided doc & store instances', () => {
      inMemory = new TokenStore('https://my_token_store', 'token_store_key_template', TokenPersist.Session)
      expect(inMemory).toBeInstanceOf(TokenStore)
      expect(inMemory.tokenStoreType).toEqual(TokenStoreType.SessionStorage)
    })

    it("can be constructed with a document that doesn't support cookies", () => {
      const store = new TokenStore(
        'https://my_token_store',
        'token_store_key_template',
        TokenPersist.Session,
        {} as any,
      )
      expect(store).toBeInstanceOf(TokenStore)
      expect(store.tokenStoreType).toEqual(TokenStoreType.SessionStorage)
    })

    it('should use cookies if document is available', () => {
      sessionCookie = new TokenStore(
        'https://my_token_store',
        'token_store_key_template',
        TokenPersist.Session,
        documentInstance,
        undefined,
        undefined,
      )
      expect(sessionCookie).toBeInstanceOf(TokenStore)
      expect(sessionCookie.tokenStoreType).toEqual(TokenStoreType.SessionStorage)
    })

    it('should use cookies with expiration if document is available', () => {
      expirationCookie = new TokenStore(
        'https://my_token_store',
        'token_store_key_template',
        TokenPersist.Expiration,
        documentInstance,
      )
      expect(expirationCookie).toBeInstanceOf(TokenStore)
      expect(expirationCookie.tokenStoreType).toEqual(TokenStoreType.LocalStorage)
    })

    it('should return invalid cookie if the cookie is not set', () => {
      const retrievedToken = expirationCookie['getTokenFromCookie']('invalidCookieKey', {
        cookie: 'my-cookie-value',
      } as any)
      expect(retrievedToken.IsValid()).toEqual(false)
    })

    it('should pick up global document if declared', () => {
      ;(global as any).document = { cookie: '' }
      const store = new TokenStore('https://my_token_store', 'token_store_key_template', TokenPersist.Session)
      expect(store).toBeInstanceOf(TokenStore)
      expect(store.tokenStoreType).toEqual(TokenStoreType.SessionStorage)
    })

    it('should pick up global localStorage and sessionStorage if declared', () => {
      ;(global as any).localStorage = new MockStorage()
      ;(global as any).sessionStorage = new MockStorage()
      sessionStorage = new TokenStore('https://my_token_store', 'token_store_key_template', TokenPersist.Session)
      expect(sessionStorage).toBeInstanceOf(TokenStore)
      expect(sessionStorage.tokenStoreType).toEqual(TokenStoreType.SessionStorage)
    })

    it('should work with localStorage', () => {
      ;(global as any).localStorage = new MockStorage()
      ;(global as any).sessionStorage = new MockStorage()
      localStorage = new TokenStore('https://my_token_store', 'token_store_key_template', TokenPersist.Expiration)
      expect(localStorage).toBeInstanceOf(TokenStore)
      expect(localStorage.tokenStoreType).toEqual(TokenStoreType.LocalStorage)
    })

    afterAll(() => {
      ;((...stores: TokenStore[]) => {
        for (const store of stores) {
          describe(`Store with type ${store.tokenStoreType}`, () => {
            it('Should return empty if token is not set', () => {
              const retrieved = store.GetToken('refresh')
              expect(retrieved.IsValid()).toEqual(false)
            })

            it('Should store AccessToken', () => {
              const token = MockTokenFactory.CreateValid()
              store.AccessToken = token
              const retrieved = store.AccessToken
              expect(token.IsValid()).toEqual(true)
              expect(token.toString()).toEqual(retrieved.toString())
            })

            it('Should store RefreshToken', () => {
              const token = MockTokenFactory.CreateValid()
              store.RefreshToken = token
              const retrieved = store.RefreshToken
              expect(token.IsValid()).toEqual(true)
              expect(token.toString()).toEqual(retrieved.toString())
            })
          })
        }
      })(inMemory, sessionCookie, expirationCookie, sessionStorage, localStorage)
    })
  })
})
