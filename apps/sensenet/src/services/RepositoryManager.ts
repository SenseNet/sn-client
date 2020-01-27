import { Injectable } from '@sensenet/client-utils'
import { Repository, RepositoryConfiguration } from '@sensenet/client-core'
import authService from './auth-service'

@Injectable({ lifetime: 'singleton' })
export class RepositoryManager {
  private repos: Map<string, Repository> = new Map()
  public getRepository(repositoryUrl: string, config?: RepositoryConfiguration, fetchMethod?: typeof fetch) {
    const existing = this.repos.get(repositoryUrl)
    if (existing) {
      return existing
    }
    const instance = new Repository(
      {
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
      },
      fetchMethod,
    )

    this.repos.set(repositoryUrl, instance)
    authService.user.subscribe(user => {
      if (user) {
        instance.reloadSchema()
      }
    })
    return instance
  }
}
