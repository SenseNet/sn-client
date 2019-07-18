import { Injectable, Injector } from '@furystack/inject'
import { ConstantContent } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { CommandProvider, SearchOptions } from '../CommandProviderManager'
import { ContentContextProvider } from '../ContentContextProvider'
import { LocalizationService } from '../LocalizationService'
import { PersonalSettings } from '../PersonalSettings'
import { CommandPaletteItem } from '../../hooks'

@Injectable({ lifetime: 'singleton' })
export class QueryCommandProvider implements CommandProvider {
  constructor(
    public readonly injector: Injector,
    private readonly personalSettings: PersonalSettings,
    private readonly localization: LocalizationService,
  ) {}

  public shouldExec(options: SearchOptions): boolean {
    return options.term[0] === '+'
  }

  public async getItems(options: SearchOptions): Promise<CommandPaletteItem[]> {
    const ctx = new ContentContextProvider(options.repository)
    const extendedQuery = this.personalSettings.effectiveValue
      .getValue()
      .default.commandPalette.wrapQuery.replace('{0}', options.term)
    const result = await options.repository.loadCollection<GenericContent>({
      path: ConstantContent.PORTAL_ROOT.Path,
      oDataOptions: {
        query: extendedQuery,
        top: 10,
        select: 'all',
      },
    })
    return [
      ...result.d.results.map(content => ({
        primaryText: content.DisplayName || content.Name,
        secondaryText: content.Path,
        url: ctx.getPrimaryActionUrl(content),
        content,
        icon: content.Icon,
        hits: options.term
          .substr(1)
          .replace(/\*/g, ' ')
          .replace(/\?/g, ' ')
          .split(' '),
      })),
      {
        primaryText: this.localization.currentValues.getValue().search.openInSearchTitle,
        secondaryText: this.localization.currentValues.getValue().search.openInSearchDescription,
        url: `/${btoa(options.repository.configuration.repositoryUrl)}/search/${encodeURIComponent(options.term)}`,
        content: { Type: 'Search' } as any,
        hits: [],
      },
    ]
  }
}
