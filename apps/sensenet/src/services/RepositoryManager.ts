import { Injectable } from '@furystack/inject'
import { Repository } from '@sensenet/client-core'
import { RepositoryConfiguration } from '@sensenet/client-core/dist/Repository/RepositoryConfiguration'

@Injectable()
export class RepositoryManager {
  private repos: Map<string, Repository> = new Map()
  private history: Set<string> = new Set(JSON.parse(localStorage.getItem('sensenet-repository-history') || '[]'))
  public removeFromHistory = (value: string) => this.history.delete(value)
  public getRepository(repositoryUrl: string, config?: RepositoryConfiguration) {
    const existing = this.repos.get(repositoryUrl)
    if (existing) {
      return existing
    }
    const instance = new Repository({ ...config, repositoryUrl })
    this.repos.set(repositoryUrl, instance)
    this.history.add(repositoryUrl)
    return instance
  }
}
