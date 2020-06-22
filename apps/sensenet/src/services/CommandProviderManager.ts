import { Repository } from '@sensenet/client-core'
import { Injectable, Injector } from '@sensenet/client-utils'
import { CommandPaletteItem } from '../components/command-palette/CommandPalette'
import { ResponsivePlatforms } from '../context'
import { UiSettings } from '.'

export interface CommandProvider {
  shouldExec: (options: SearchOptions) => boolean
  getItems: (options: SearchOptions) => Promise<CommandPaletteItem[]>
}

export interface SearchOptions {
  term: string
  repository: Repository
  device: ResponsivePlatforms
  uiSettings: UiSettings
}

@Injectable({ lifetime: 'singleton' })
export class CommandProviderManager {
  public readonly Providers: CommandProvider[] = []
  public RegisterProviders(...providerTypes: Array<new (...args: any[]) => CommandProvider>) {
    for (const providerType of providerTypes) {
      if (!this.Providers.find((p) => p instanceof providerType)) {
        const instance = this.injector.getInstance(providerType)
        this.Providers.push(instance)
      }
    }
  }

  public async getItems(options: SearchOptions) {
    const promises = this.Providers.filter((p) => p.shouldExec(options)).map((provider) => provider.getItems(options))
    const results = await Promise.all(promises)
    return results.reduce((acc, val) => acc.concat(val), []) // flatten
  }

  constructor(private readonly injector: Injector) {}
}
