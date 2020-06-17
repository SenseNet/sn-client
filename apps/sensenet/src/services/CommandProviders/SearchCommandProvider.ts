import { ConstantContent } from '@sensenet/client-core'
import { Injectable, Injector } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { PATHS } from '../../application-paths'
import { CommandPaletteItem } from '../../components/command-palette/CommandPalette'
import { CommandProvider, SearchOptions } from '../CommandProviderManager'
import { getPrimaryActionUrl } from '../content-context-service'
import { LocalizationService } from '../LocalizationService'

@Injectable({ lifetime: 'singleton' })
export class SearchCommandProvider implements CommandProvider {
  constructor(public readonly injector: Injector, private readonly localization: LocalizationService) {}

  public shouldExec({ term }: SearchOptions): boolean {
    return !!term && term[0] !== '>' && term[0] !== '?'
  }

  public async getItems(options: SearchOptions): Promise<CommandPaletteItem[]> {
    const extendedQuery = `${options.term.trim()}* .AUTOFILTERS:OFF`
    const result = await options.repository.loadCollection<GenericContent>({
      path: ConstantContent.PORTAL_ROOT.Path,
      oDataOptions: {
        query: extendedQuery,
        top: 5,
      } as any,
    })
    return [
      {
        primaryText: this.localization.currentValues.getValue().search.openInSearchTitle(options.term),
        url: `${PATHS.search.appPath}?term=${encodeURIComponent(options.term)}`,
        content: { Type: 'Search' } as any,
        hits: [],
      },
      ...result.d.results.map((content) => ({
        primaryText: content.DisplayName || content.Name,
        secondaryText: content.Path,
        url: getPrimaryActionUrl(content, options.repository),
        content,
        icon: content.Icon,
        hits: options.term.replace(/\*/g, ' ').replace(/\?/g, ' ').split(' '),
      })),
    ]
  }
}
