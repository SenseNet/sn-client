import { OauthProvider } from '../src/OauthProvider'

export class MockOauthProvider implements OauthProvider {
  public dispose: () => void | Promise<void>
  public getToken(): Promise<string> {
    throw new Error('Method not implemented.')
  }
  public login(token: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
