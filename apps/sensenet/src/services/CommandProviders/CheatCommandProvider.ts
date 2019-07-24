import { Injectable } from '@furystack/inject'
import { CommandProvider, SearchOptions } from '../CommandProviderManager'
import { CommandPaletteItem } from '../../hooks'

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

  public shouldExec(options: SearchOptions) {
    return Object.keys(this.items).indexOf(options.term) !== -1
  }
  public async getItems(options: SearchOptions): Promise<CommandPaletteItem[]> {
    return (this.items as any)[options.term]
  }
}
