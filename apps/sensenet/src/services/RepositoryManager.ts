import { Injectable, Injector } from '@furystack/inject'
import { FormsAuthenticationService, LoginState, Repository } from '@sensenet/client-core'
import { RepositoryConfiguration } from '@sensenet/client-core/dist/Repository/RepositoryConfiguration'
import { EventHub } from '@sensenet/repository-events'
import { RequestCounterService } from './request-counter-service'

@Injectable({ lifetime: 'singleton' })
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
    const instance = new Repository(
      {
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
          'CreationDate',
        ],
        ...config,
        repositoryUrl,
      },
      (input: RequestInfo, init?: RequestInit) => {
        try {
          this.injector
            .getInstance(RequestCounterService)
            .countRequest(new URL(input.toString()).hostname, init && init.method === 'POST' ? 'POST' : 'GET')
        } catch (error) {
          this.injector.getInstance(RequestCounterService).resetToday()
          this.injector.logger.warning({
            scope: 'RepositoryManager',
            message: 'Failed to log the request count :(',
            data: { details: { error } },
          })
        }
        return fetch(input, init)
      },
    )

    FormsAuthenticationService.Setup(instance, {
      select: 'all',
    })
    this.repos.set(repositoryUrl, instance)
    instance.authentication.state.subscribe(s => {
      if (s === LoginState.Authenticated) {
        instance.reloadSchema()
      }
    })
    return instance
  }

  constructor(private readonly injector: Injector) {}
}
