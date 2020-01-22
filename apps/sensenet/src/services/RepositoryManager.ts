import { Injectable } from '@sensenet/client-utils'
import { LoginState, Repository, RepositoryConfiguration } from '@sensenet/client-core'

@Injectable({ lifetime: 'singleton' })
export class RepositoryManager {
  private repos: Map<string, Repository> = new Map()
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
        'CreationDate',
        'Avatar',
      ],
      ...config,
      repositoryUrl,
    })

    this.repos.set(repositoryUrl, instance)
    instance.authentication.state.subscribe(s => {
      if (s === LoginState.Authenticated) {
        instance.reloadSchema()
      }
    })
    return instance
  }
}
