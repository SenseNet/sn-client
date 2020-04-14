import { Injectable, Injector } from '@sensenet/client-utils'
import { FormsAuthenticationService, LoginState, Repository, RepositoryConfiguration } from '@sensenet/client-core'
import { RequestCounterService } from './request-counter-service'

@Injectable({ lifetime: 'singleton' })
export class RepositoryManager {
  private repos: Map<string, Repository> = new Map()
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
          'IsFile',
          'IsFolder',
          'ParentId',
          'Version',
          'PageCount' as any,
          'Binary',
          'CreationDate',
          'Avatar',
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
    instance.authentication.state.subscribe((s) => {
      if (s === LoginState.Authenticated) {
        instance.reloadSchema()
      }
    })
    return instance
  }

  constructor(private readonly injector: Injector) {}
}
