import { Injectable, Injector } from '@furystack/inject'
import { ConstantContent, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { CommandPaletteItem } from '../../store/CommandPalette'
import { CommandProvider } from '../CommandProviderManager'
import { ContentContextProvider } from '../ContentContextProvider'
import { LocalizationService } from '../LocalizationService'
import { PersonalSettings } from '../PersonalSettings'

@Injectable({ lifetime: 'singleton' })
export class QueryCommandProvider implements CommandProvider {
  constructor(
    public readonly injector: Injector,
    private readonly personalSettings: PersonalSettings,
    private readonly localization: LocalizationService,
  ) {}

  public shouldExec(searchTerm: string): boolean {
    return searchTerm[0] === '+'
  }

  public async getItems(query: string, repo: Repository): Promise<CommandPaletteItem[]> {
    const ctx = new ContentContextProvider(repo)
    const extendedQuery = this.personalSettings.currentValue
      .getValue()
      .default.commandPalette.wrapQuery.replace('{0}', query)
    const result = await repo.loadCollection<GenericContent>({
      path: ConstantContent.PORTAL_ROOT.Path,
      oDataOptions: {
        query: extendedQuery,
        top: 10,
        select: 'all',
      },
    })
    return [
      ...result.d.results.map(
        content =>
          ({
            primaryText: content.DisplayName || content.Name,
            secondaryText: content.Path,
            url: ctx.getPrimaryActionUrl(content),
            content,
            icon: content.Icon,
            hits: query
              .substr(1)
              .replace(/\*/g, ' ')
              .replace(/\?/g, ' ')
              .split(' '),
          } as CommandPaletteItem),
      ),
      {
        primaryText: this.localization.currentValues.getValue().search.openInSearchTitle,
        secondaryText: this.localization.currentValues.getValue().search.openInSearchDescription,
        url: `/${btoa(repo.configuration.repositoryUrl)}/search/${encodeURIComponent(query)}`,
        content: { Type: 'Search' } as any,
        hits: [],
      },
    ]
  }
}
