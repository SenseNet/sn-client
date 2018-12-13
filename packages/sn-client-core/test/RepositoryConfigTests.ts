import 'jest'
import { RepositoryConfiguration } from '../src/Repository/RepositoryConfiguration'

// tslint:disable:completed-docs
describe('RepositoryConfig', () => {
  it('Should be constructed without options', () => {
    const c = new RepositoryConfiguration()
    expect(c).toBeInstanceOf(RepositoryConfiguration)
  })

  it('Should be constructed with options', () => {
    const c = new RepositoryConfiguration({ repositoryUrl: 'https://sensenet.com' })
    expect(c).toBeInstanceOf(RepositoryConfiguration)
  })

  describe('#DEFAULT_BASE_URL', () => {
    it('Should be empty if no window is available', () => {
      RepositoryConfiguration.windowInstance = undefined as any
      expect(RepositoryConfiguration.DEFAULT_BASE_URL).toBe('')
    })

    it('Should be empty if no window.location is available', () => {
      RepositoryConfiguration.windowInstance = {} as any
      expect(RepositoryConfiguration.DEFAULT_BASE_URL).toBe('')
    })

    it('Should point to window.location if available', () => {
      RepositoryConfiguration.windowInstance = { location: { origin: 'https://sensenet.com' } } as any
      expect(RepositoryConfiguration.DEFAULT_BASE_URL).toBe('https://sensenet.com')
    })
  })
})
