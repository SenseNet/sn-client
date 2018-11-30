import { Token } from '@sensenet/authentication-jwt/dist/Token'
import { TokenPayload } from '@sensenet/authentication-jwt/dist/TokenPayload'

// tslint:disable
export class MockTokenFactory {
  private static getStillValidDate() {
    const date = new Date()
    date.setTime(date.getTime() + 3000000)
    return date.getTime() / 1000
  }

  private static createWithDates(expiration: number, notBefore: number): Token {
    const header = {}
    const payload = {
      aud: '',
      exp: expiration,
      iat: 0,
      iss: '',
      name: 'BuiltIn\\Mock',
      nbf: notBefore,
      sub: '',
    } as TokenPayload

    const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64')

    const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64')
    return Token.FromHeadAndPayload(`${headerEncoded}.${payloadEncoded}`)
  }

  public static CreateValid() {
    return this.createWithDates(this.getStillValidDate(), 1)
  }

  public static CreateExpired() {
    return this.createWithDates(1, this.getStillValidDate())
  }

  public static CreateNotValidYet() {
    return this.createWithDates(this.getStillValidDate(), this.getStillValidDate())
  }
}
