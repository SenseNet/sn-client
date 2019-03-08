import { Injectable } from '@furystack/inject'
import { FormsAuthenticationService, Repository } from '@sensenet/client-core'
import { RepositoryConfiguration } from '@sensenet/client-core/dist/Repository/RepositoryConfiguration'
import { ObservableValue } from '@sensenet/client-utils'
import { EventHub } from '@sensenet/repository-events'

@Injectable()
export class RepositoryManager {
  private repos: Map<string, Repository> = new Map()

  private eventHubs: Map<string, EventHub> = new Map()

  private history: Set<string> = new Set(JSON.parse(localStorage.getItem('sensenet-repository-history') || '[]'))
  public currentRepository = new ObservableValue<Repository>(new Repository())
  public removeFromHistory = (value: string) => this.history.delete(value)

  public getEventHub(repositoryUrl: string) {
    const existing = this.eventHubs.get(repositoryUrl)
    if (existing) {
      return existing
    }
    const instance = new EventHub(this.getRepository(repositoryUrl))
    this.eventHubs.set(repositoryUrl, instance)
    return instance
  }

  public getCurrentEventHub() {
    return this.getEventHub(this.currentRepository.getValue().configuration.repositoryUrl)
  }

  public getRepository(repositoryUrl: string, config?: RepositoryConfiguration) {
    const existing = this.repos.get(repositoryUrl)
    if (existing) {
      return existing
    }
    const instance = new Repository({ ...config, repositoryUrl })

    FormsAuthenticationService.Setup(instance, {
      select: 'all',
    })

    this.repos.set(repositoryUrl, instance)
    this.history.add(repositoryUrl)
    return instance
  }
}
