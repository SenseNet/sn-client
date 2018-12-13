import 'jest'
import { JSDOM } from 'jsdom'
import { GoogleAuthenticationOptions } from '../src/GoogleAuthenticationOptions'

// tslint:disable:completed-docs
describe('Google Authentication Options', () => {
  it(' can be constructed with valid default parameters', () => {
    const exampleOrigin = 'http://example.origin.com'
    const exampleClientId = 'exampleAppId'
    const dom = new JSDOM('', { url: exampleOrigin, referrer: exampleOrigin })
    const options = new GoogleAuthenticationOptions(
      {
        clientId: exampleClientId,
      },
      dom.window,
    )
    expect(options).toBeInstanceOf(GoogleAuthenticationOptions)
    expect(options.clientId).toBe(exampleClientId)
    expect(options.redirectUri).toBe(exampleOrigin + '/')
    expect(options.scope).toEqual(['email', 'profile'])
  })
  it('can be constructed with valid specified parameters', () => {
    const exampleClientId = 'ExampleClientId2'
    const exampleRedirectUri = 'exampleRedirectUri'
    const exampleScope = ['item1', 'item2']

    const options = new GoogleAuthenticationOptions({
      clientId: exampleClientId,
      redirectUri: exampleRedirectUri,
      scope: exampleScope,
    })

    expect(options).toBeInstanceOf(GoogleAuthenticationOptions)
    expect(options.clientId).toBe(exampleClientId)
    expect(options.redirectUri).toBe(exampleRedirectUri)
    expect(options.scope).toBe(exampleScope)
  })
})
