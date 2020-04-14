import { TokenPayload } from './TokenPayload'

/**
 * This class represents a sense NET JWT Token instance.
 */
export class Token {
  private get _tokenPayload(): TokenPayload {
    try {
      return JSON.parse(Buffer.from(this.payloadEncoded, 'base64').toString()) as TokenPayload
    } catch (err) {
      return {
        aud: '',
        exp: 0,
        iat: 0,
        iss: '',
        name: '',
        nbf: 0,
        sub: '',
      }
    }
  }

  private fromEpoch(epoch: number): Date {
    const d = new Date(0)
    d.setUTCSeconds(epoch)
    return d
  }

  /**
   * The Username from the current Token payload
   */
  public get Username(): string {
    return this._tokenPayload.name
  }

  /**
   * The current Token full Payload
   */
  public GetPayload(): TokenPayload {
    return this._tokenPayload
  }

  /**
   * The Date when the token will expire
   */
  public get ExpirationTime(): Date {
    return this.fromEpoch(this._tokenPayload.exp)
  }

  /**
   * The token will be valid only after this date
   */
  public get NotBefore(): Date {
    return this.fromEpoch(this._tokenPayload.nbf)
  }

  /**
   * Indicates if the Token is valid based on it's ExpirationTime and NotBefore values.
   */
  public IsValid(excludeNotBefore = false): boolean {
    const now = new Date()
    return this._tokenPayload && this.ExpirationTime > now && (excludeNotBefore || this.NotBefore < now)
  }

  /**
   * awaits the notBefore value
   */
  public async AwaitNotBeforeTime() {
    const now = new Date()
    // expired tokens shouldn't be awaited
    if (this._tokenPayload && this.ExpirationTime > now) {
      const awaitMillis = this.NotBefore.getTime() - now.getTime()
      // check if NotBefore time already passed
      if (awaitMillis > 0) {
        await new Promise((resolve) => {
          setTimeout(() => resolve(), awaitMillis + 1000)
        })
      }
    }
  }

  /**
   * The date when the Token was issued
   */
  public get IssuedDate() {
    return this.fromEpoch(this._tokenPayload.iat)
  }

  /**
   * Returns the Token in string format (in a base64 encoded, dot separated header and payload)
   */
  public toString() {
    return `${this.headerEncoded}.${this.payloadEncoded}`
  }

  /**
   * Factory method to create a token from a sense NET specific base64 encoded header and payload string, e.g.:
   * ```
   * const myToken = Token.FromHeadAndPayload("e30=.eyJhdWQiOiIiLCJleHAiOjE0OTQ1NzkwOTUuMTIsImlhdCI6MCwiaXNzIjoiIiwibmFtZSI6IiIsIm5iZiI6MSwic3ViIjoiIn0=");
   * ```
   * @constructs Token
   */
  public static FromHeadAndPayload(headAndPayload: string): Token {
    const [head, payload] = headAndPayload.split('.')
    return new Token(head, payload)
  }

  /**
   * Factory method for creating empty (invalid) tokens
   * ```
   * const invalidToken = Token.CreateEmpty();
   * ```
   * @constructs Token
   */
  public static CreateEmpty(): Token {
    return new Token('', '')
  }

  private constructor(private readonly headerEncoded: string, private readonly payloadEncoded: string) {}
}
