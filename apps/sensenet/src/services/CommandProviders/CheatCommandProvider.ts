import { Injectable } from '@furystack/inject'
import { CommandPaletteItem } from '../../store/CommandPalette'
import { CommandProvider } from '../CommandProviderManager'

@Injectable({ lifetime: 'singleton' })
export class CheatCommandProvider implements CommandProvider {
  public items: Record<string, CommandPaletteItem> = {
    iddqd: {
      primaryText: 'GOD MODE ON',
      secondaryText: '',
      url: '',
      openAction: () => window.open('https://classicreload.com/dosx-doom.html'),
      content: {
        Id: 0,
        Path: '',
        Name: '',
        Type: 'DoomCheatContent',
      },
      hits: ['iddqd'],
    },
    'pot of gold': {
      primaryText: 'cheat enabled you wascally wabbit',
      secondaryText: 'now take a screenshot and go talk to your line manager',
      url: '',
      openAction: () => window.open('https://www.playdosgames.com/play/warcraft-orcs-humans/'),
      content: {
        Id: 0,
        Path: '',
        Name: '',
        Type: 'WarCheatContent',
      },
      hits: ['pot of gold'],
    },
  }

  public shouldExec(term: string) {
    return Object.keys(this.items).indexOf(term) !== -1
  }
  public async getItems(term: string): Promise<CommandPaletteItem[]> {
    return (this.items as any)[term]
  }
}
