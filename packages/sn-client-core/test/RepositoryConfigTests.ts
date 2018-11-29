import { expect } from 'chai'
import { RepositoryConfiguration } from '../src/Repository/RepositoryConfiguration'

// tslint:disable:completed-docs
declare const global: any

export const repositoryConfigTests: Mocha.Suite = describe('RepositoryConfig', () => {
  it('Should be constructed without options', () => {
    const c = new RepositoryConfiguration()
    expect(c).to.be.instanceof(RepositoryConfiguration)
  })

  it('Should be constructed with options', () => {
    const c = new RepositoryConfiguration({ repositoryUrl: 'https://sensenet.com' })
    expect(c).to.be.instanceof(RepositoryConfiguration)
  })

  describe('#DEFAULT_BASE_URL', () => {
    it('Should be empty if no window is available', () => {
      global.window = undefined
      expect(RepositoryConfiguration.DEFAULT_BASE_URL).to.be.eq('')
    })

    it('Should be empty if no window.location is available', () => {
      global.window = {}
      expect(RepositoryConfiguration.DEFAULT_BASE_URL).to.be.eq('')
    })

    it('Should point to window.location if available', () => {
      global.window = { location: { origin: 'https://sensenet.com' } }
      expect(RepositoryConfiguration.DEFAULT_BASE_URL).to.be.eq('https://sensenet.com')
    })
  })
})
