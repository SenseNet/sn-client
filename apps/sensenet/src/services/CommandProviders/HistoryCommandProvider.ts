import { Injectable } from '@furystack/inject'
import { CommandProvider, SearchOptions } from '../CommandProviderManager'
import { CommandPaletteItem } from '../../hooks'

@Injectable({ lifetime: 'singleton' })
export class HistoryCommandProvider implements CommandProvider {
  public shouldExec({ term }: SearchOptions) {
    return term.length === 0
  }
  public async getItems(): Promise<CommandPaletteItem[]> {
    return [
      {
        primaryText: 'Recently Opened Example',
        secondaryText: "You've opened recently this stuff",
        url: '',
        hits: [],
      },
    ]
  }
}
