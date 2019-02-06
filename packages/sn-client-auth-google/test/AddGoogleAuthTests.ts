import { JwtService } from '@sensenet/authentication-jwt'
import { Repository } from '@sensenet/client-core'
import { addGoogleAuth } from '../src/AddGoogleAuth'
import { GoogleOauthProvider } from '../src/GoogleOauthProvider'

// tslint:disable:completed-docs

describe('RepositoryExtensions', () => {
  it('Can be configured on a Repository', () => {
    const repo = new Repository()
    const jwt = JwtService.setup(repo)
    const googleOauthProvider = addGoogleAuth(jwt, { clientId: '' })
    expect(googleOauthProvider).toBeInstanceOf(GoogleOauthProvider)
  })
})
