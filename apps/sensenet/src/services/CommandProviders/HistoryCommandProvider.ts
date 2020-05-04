import { Injectable } from '@sensenet/client-utils'
import { CommandPaletteItem } from '../../components/command-palette/CommandPalette'
import { CommandProvider, SearchOptions } from '../CommandProviderManager'

@Injectable({ lifetime: 'singleton' })
export class HistoryCommandProvider implements CommandProvider {
  public shouldExec({ term }: SearchOptions) {
    return term != null && term.length === 0
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
