import { Injectable } from '@furystack/inject'
import { FormsAuthenticationService, Repository } from '@sensenet/client-core'
import { RepositoryConfiguration } from '@sensenet/client-core/dist/Repository/RepositoryConfiguration'
import { EventHub } from '@sensenet/repository-events'

@Injectable()
export class RepositoryManager {
  private repos: Map<string, Repository> = new Map()
  private eventHubs: Map<string, EventHub> = new Map()
  public getEventHub(repositoryUrl: string) {
    const existing = this.eventHubs.get(repositoryUrl)
    if (existing) {
      return existing
    }
    const instance = new EventHub(this.getRepository(repositoryUrl))
    this.eventHubs.set(repositoryUrl, instance)
    return instance
  }
  public getRepository(repositoryUrl: string, config?: RepositoryConfiguration) {
    const existing = this.repos.get(repositoryUrl)
    if (existing) {
      return existing
    }
    const instance = new Repository({
      ...{
        sessionLifetime: 'expiration',
      },
      requiredSelect: [
        'Id',
        'Path',
        'Name',
        'Type',
        'DisplayName',
        'Icon',
        'IsFolder',
        'ParentId',
        'Version',
        'PageCount' as any,
        'Binary',
      ],
      ...config,
      repositoryUrl,
    })

    FormsAuthenticationService.Setup(instance, {
      select: 'all',
    })

    this.repos.set(repositoryUrl, instance)
    return instance
  }
}
