import { Injectable } from '@sensenet/client-utils'
import { PATHS, resolvePathParams } from '../../application-paths'
import { CommandPaletteItem } from '../../components/command-palette/CommandPalette'
import { CommandProvider, SearchOptions } from '../CommandProviderManager'
import { LocalizationService } from '../LocalizationService'

@Injectable({ lifetime: 'transient' })
export class NavigationCommandProvider implements CommandProvider {
  public getRoutes: ({ term }: SearchOptions) => Array<CommandPaletteItem & { keywords?: string }> = ({ term }) => {
    return [
      {
        primaryText: this.localizationValues.contentPrimary,
        url: resolvePathParams({ path: PATHS.content.appPath }),
        secondaryText: this.localizationValues.contentSecondary,
        content: { Type: 'PortalRoot' } as any,
        keywords: 'explore browse repository',
        hits: [term],
      },
      {
        primaryText: this.localizationValues.searchPrimary,
        url: PATHS.search.appPath,
        secondaryText: this.localizationValues.searchSecondaryText,
        content: { Type: 'Search' } as any,
        keywords: 'search find content query',
        hits: [term],
      },
      {
        primaryText: this.localizationValues.savedQueriesPrimary,
        url: PATHS.savedQueries.appPath,
        secondaryText: this.localizationValues.savedQueriesSecondaryText,
        content: { Type: 'Search' } as any,
        keywords: 'saved query search find',
        hits: [term],
      },
      {
        primaryText: this.localizationValues.eventsPrimary,
        url: resolvePathParams({ path: PATHS.events.appPath }),
        secondaryText: this.localizationValues.eventsSecondary,
        content: { Type: 'EventLog' } as any,
        keywords: 'event events error warning log logs',
        hits: [term],
      },
    ]
  }

  private localizationValues: ReturnType<LocalizationService['currentValues']['getValue']>['navigationCommandProvider']

  private routeIncludesTerm(route: CommandPaletteItem & { keywords?: string }, termLowerCase: string) {
    return (
      route.primaryText.toLocaleLowerCase().includes(termLowerCase) ||
      route.secondaryText?.includes(termLowerCase) ||
      route.keywords?.includes(termLowerCase)
    )
  }

  public shouldExec(options: SearchOptions) {
    return !options.term
  }

  public async getItems(options: SearchOptions): Promise<CommandPaletteItem[]> {
    const termLowerCase = options.term.toLocaleLowerCase()
    return this.getRoutes(options).filter((route) => this.routeIncludesTerm(route, termLowerCase))
  }

  constructor(localization: LocalizationService) {
    this.localizationValues = localization.currentValues.getValue().navigationCommandProvider
  }
}
