import { OauthProvider } from '../../src/OauthProvider'

export class MockOauthProvider implements OauthProvider {
  public async dispose() {
    /** */
  }
  public getToken(): Promise<string> {
    throw new Error('Method not implemented.')
  }
  public login(_token: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
