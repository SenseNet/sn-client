import { Token } from '../src/Token'
import { MockTokenFactory } from './__Mocks__/MockTokenFactory'

// tslint:disable:completed-docs

describe('Token', () => {
  it('should be constructed', () => {
    const t = MockTokenFactory.CreateValid()
    expect(t).toBeInstanceOf(Token)
  })

  it('should have a username', () => {
    const t = MockTokenFactory.CreateValid()
    expect(t.Username).toEqual('BuiltIn\\Mock')
  })

  it('should have a payload', () => {
    const t = MockTokenFactory.CreateValid()
    expect(t.GetPayload()).toBeInstanceOf(Object)
  })

  it('should have an IssuedDate', () => {
    const t = MockTokenFactory.CreateValid()
    expect(t.IssuedDate).toBeInstanceOf(Date)
  })

  it('should be able to await its notBefore time', async () => {
    const t = MockTokenFactory.CreateNotValidYet(1000)
    expect(t.IsValid()).toEqual(false)
    await t.AwaitNotBeforeTime()
    expect(t.IsValid()).toEqual(true)
  })
})
