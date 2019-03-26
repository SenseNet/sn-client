import { Injectable } from '@furystack/inject'
import { CommandPaletteItem } from '../../store/CommandPalette'
import { CommandProvider } from '../CommandProviderManager'

@Injectable()
export class HelpCommandProvider implements CommandProvider {
  public shouldExec(term: string) {
    return term === '?' || term === 'help'
  }

  public async getItems(_term: string): Promise<CommandPaletteItem[]> {
    return [
      {
        primaryText: 'Help Item 1',
        secondaryText: 'HelpItemke Eggggy',
        url: '',
      },
    ]
  }
}
