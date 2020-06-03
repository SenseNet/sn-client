import { Injectable } from '@sensenet/client-utils'
import { CommandPaletteItem } from '../../components/command-palette/CommandPalette'
import { CommandProvider, SearchOptions } from '../CommandProviderManager'
import { LocalizationService } from '../LocalizationService'

@Injectable({ lifetime: 'transient' })
export class HelpCommandProvider implements CommandProvider {
  public shouldExec({ term }: SearchOptions) {
    return term === '?'
  }

  public async getItems({ term }: SearchOptions): Promise<CommandPaletteItem[]> {
    const commandPaletteHelpLocalization = this.localizationService.currentValues.getValue().commandPalette.help
    return [
      {
        primaryText: commandPaletteHelpLocalization.readMeTitle,
        secondaryText: commandPaletteHelpLocalization.readMeDescription,
        url: '',
        content: { Type: 'File' } as any,
        openAction: () => window.open('https://github.com/SenseNet/sn-client/blob/master/apps/sensenet/README.md'),
        hits: [term],
      },
      {
        primaryText: commandPaletteHelpLocalization.communitySiteTitle,
        secondaryText: commandPaletteHelpLocalization.communitySiteDescription,
        url: '',
        content: { Type: 'Group' } as any,
        openAction: () => window.open('https://community.sensenet.com'),
        hits: [term],
      },
      {
        primaryText: commandPaletteHelpLocalization.docsSiteTitle,
        secondaryText: commandPaletteHelpLocalization.docsSiteDescription,
        url: '',
        content: { Type: 'Link' } as any,
        openAction: () => window.open('https://docs.sensenet.com'),
        hits: [term],
      },
      {
        primaryText: commandPaletteHelpLocalization.gitterTitle,
        secondaryText: commandPaletteHelpLocalization.gitterDescription,
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
