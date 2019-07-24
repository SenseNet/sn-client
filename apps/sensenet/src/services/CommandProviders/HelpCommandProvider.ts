import { Injectable } from '@furystack/inject'
import { CommandProvider, SearchOptions } from '../CommandProviderManager'
import { LocalizationService } from '../LocalizationService'
import { CommandPaletteItem } from '../../hooks'

@Injectable({ lifetime: 'transient' })
export class HelpCommandProvider implements CommandProvider {
  public shouldExec({ term }: SearchOptions) {
    return term === '?' || term === 'help'
  }

  public async getItems({ term }: SearchOptions): Promise<CommandPaletteItem[]> {
    return [
      {
        primaryText: this.localizationService.currentValues.getValue().commandPalette.help.readMeTitle,
        secondaryText: this.localizationService.currentValues.getValue().commandPalette.help.readMeDescription,
        url: '',
        content: { Type: 'File' } as any,
        openAction: () => window.open('https://github.com/SenseNet/sn-client/blob/master/apps/sensenet/README.md'),
        hits: [term],
      },
      {
        primaryText: this.localizationService.currentValues.getValue().commandPalette.help.communitySiteTitle,
        secondaryText: this.localizationService.currentValues.getValue().commandPalette.help.communitySiteDescription,
        url: '',
        content: { Type: 'Group' } as any,
        openAction: () => window.open('https://community.sensenet.com'),
        hits: [term],
      },
      {
        primaryText: this.localizationService.currentValues.getValue().commandPalette.help.gitterTitle,
        secondaryText: this.localizationService.currentValues.getValue().commandPalette.help.gitterDescription,
        url: '',
        content: { Type: 'Comment' } as any,
        openAction: () =>
          window.open(
            'https://gitter.im/SenseNet/sensenet?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge',
          ),
        hits: [term],
      },
    ]
  }

  constructor(private readonly localizationService: LocalizationService) {}
}
