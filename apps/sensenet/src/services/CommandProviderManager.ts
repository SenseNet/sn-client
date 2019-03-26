import { Injectable, Injector } from '@furystack/inject'
import { Repository } from '@sensenet/client-core'
import { CommandPaletteItem } from '../store/CommandPalette'

export interface CommandProvider {
  shouldExec: (term: string) => boolean
  getItems: (term: string, repo: Repository) => Promise<CommandPaletteItem[]>
}

@Injectable()
export class CommandProviderManager {
  public readonly Providers: CommandProvider[] = []
  public RegisterProviders(...providerTypes: Array<new (...args: any[]) => CommandProvider>) {
    for (const providerType of providerTypes) {
      if (!this.Providers.find(p => p instanceof providerType)) {
        const instance = this.injector.GetInstance(providerType)
        this.Providers.push(instance)
      }
    }
  }

  public async getItems(term: string, repo: Repository) {
    const promises = this.Providers.filter(p => p.shouldExec(term)).map(provider => provider.getItems(term, repo))
    const results = await Promise.all(promises)
    return results.reduce((acc, val) => acc.concat(val), []) // flattern
  }

  constructor(private readonly injector: Injector) {}
}
