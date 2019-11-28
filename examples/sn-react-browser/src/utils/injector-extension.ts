import { Injector } from '@furystack/inject/dist/Injector'
import { Repository } from '@sensenet/client-core'
import { RepositoryConfiguration } from '@sensenet/client-core/dist/Repository/RepositoryConfiguration'
import { EventHub } from '@sensenet/repository-events'
import { RepositoryManager } from '../service/repository-manager'

declare module '@furystack/inject/dist/Injector' {
  /**
   * Defines an extended Injector instance
   */
  interface Injector {
    getRepository: (url: string, config?: RepositoryConfiguration) => Repository
    getEventHub: (url: string) => EventHub
  }
}

Injector.prototype.getRepository = function(url, config) {
  const manager = this.getInstance(RepositoryManager)
  const repo = manager.getRepository(url, config)
  this.setExplicitInstance(repo)
  return repo
}

Injector.prototype.getEventHub = function(name) {
  return this.getInstance(RepositoryManager).getEventHub(name)
}
