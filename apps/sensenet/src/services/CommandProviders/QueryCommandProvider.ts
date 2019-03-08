import { Injectable, Injector } from '@furystack/inject'
import { ConstantContent } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { CommandPaletteItem } from '../../store/CommandPalette'
import { CommandProvider } from '../CommandProviderManager'
import { ContentContextProvider } from '../ContentContextProvider'
import { PersonalSettings } from '../PersonalSettings'

@Injectable()
export class QueryCommandProvider implements CommandProvider {
  constructor(private readonly injector: Injector, private readonly personalSettings: PersonalSettings) {}

  public shouldExec(searchTerm: string): boolean {
    return searchTerm[0] === '+'
  }

  public async getItems(query: string): Promise<CommandPaletteItem[]> {
    const extendedQuery = this.personalSettings.currentValue
      .getValue()
      .default.commandPalette.wrapQuery.replace('{0}', query)
    const result = await this.injector.getCurrentRepository().loadCollection<GenericContent>({
      path: ConstantContent.PORTAL_ROOT.Path,
      oDataOptions: {
        query: extendedQuery,
        top: 10,
        select: 'all',
      },
    })
    return result.d.results.map(
      content =>
        ({
          primaryText: content.DisplayName || content.Name,
          secondaryText: content.Path,
          url: this.injector
            .GetInstance(ContentContextProvider)
            .getPrimaryActionUrl(content, this.injector.getCurrentRepository().schemas),
          content,
          icon: content.Icon,
        } as CommandPaletteItem),
    )
  }
}
