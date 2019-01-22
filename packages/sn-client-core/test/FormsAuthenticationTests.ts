import 'jest'
import { FormsAuthenticationService } from '../src'

describe('Forms Authentication', () => {
  /** */
  it('Should be constructed', () => {
    const s = new FormsAuthenticationService({} as any)
    expect(s).toBeInstanceOf(FormsAuthenticationService)
  })
})
