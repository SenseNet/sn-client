import { Injector } from '@sensenet/client-utils/dist/inject/injector'
import { Repository, RepositoryConfiguration } from '@sensenet/client-core'
import { RepositoryManager } from '../services/RepositoryManager'

declare module '@sensenet/client-utils/dist/inject/injector' {
  /**
   * Defines an extended Injector instance
   */
  interface Injector {
    getRepository: (url: string, config?: RepositoryConfiguration) => Repository
  }
}

Injector.prototype.getRepository = function(url, config) {
  const manager = this.getInstance(RepositoryManager)
  const repo = manager.getRepository(url, config)
  this.setExplicitInstance(repo)
  return repo
}
