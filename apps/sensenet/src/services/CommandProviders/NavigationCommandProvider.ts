import { Injectable } from '@sensenet/client-utils'
import { applicationPaths, resolvePathParams } from '../../application-paths'
import { CommandPaletteItem } from '../../components/command-palette/CommandPalette'
import { CommandProvider, SearchOptions } from '../CommandProviderManager'
import { LocalizationService } from '../LocalizationService'

@Injectable({ lifetime: 'transient' })
export class NavigationCommandProvider implements CommandProvider {
  public getRoutes: ({ term, device }: SearchOptions) => Array<CommandPaletteItem & { keywords?: string }> = ({
    term,
    device,
  }) => {
    return [
      ...(device !== 'mobile'
        ? [
            {
              primaryText: this.localizationValues.personalSettingsPrimary,
              url: applicationPaths.personalSettings,
              secondaryText: this.localizationValues.personalSettingsSecondary,
              content: { Type: 'Settings' } as any,
              keywords: 'settings setup personal settings language theme',
              hits: [term],
            },
          ]
        : []),
      ...[
        {
          primaryText: this.localizationValues.contentPrimary,
          url: resolvePathParams({ path: applicationPaths.browse }),
          secondaryText: this.localizationValues.contentSecondary,
          content: { Type: 'PortalRoot' } as any,
          keywords: 'explore browse repository',
          hits: [term],
        },
        {
          primaryText: this.localizationValues.searchPrimary,
          url: applicationPaths.search,
          secondaryText: this.localizationValues.searchSecondaryText,
          content: { Type: 'Search' } as any,
          keywords: 'search find content query',
          hits: [term],
        },
        {
          primaryText: this.localizationValues.savedQueriesPrimary,
          url: applicationPaths.savedQueries,
          secondaryText: this.localizationValues.savedQueriesSecondaryText,
          content: { Type: 'Search' } as any,
          keywords: 'saved query search find',
          hits: [term],
        },
        {
          primaryText: this.localizationValues.eventsPrimary,
          url: resolvePathParams({ path: applicationPaths.events }),
          secondaryText: this.localizationValues.eventsSecondary,
          content: { Type: 'EventLog' } as any,
          keywords: 'event events error warning log logs',
          hits: [term],
        },
      ],
    ]
  }

  private localizationValues: ReturnType<LocalizationService['currentValues']['getValue']>['navigationCommandProvider']

  public shouldExec(options: SearchOptions) {
    const termLowerCase = options.term && options.term.toLocaleLowerCase()
    return (
      options.term != null &&
      this.getRoutes(options).find(
        (r) =>
          r.primaryText.toLocaleLowerCase().includes(termLowerCase) ||
          r.secondaryText.includes(termLowerCase) ||
          (r.keywords && r.keywords.includes(termLowerCase) ? true : false),
      ) !== undefined
    )
  }

  public async getItems(options: SearchOptions): Promise<CommandPaletteItem[]> {
    return this.getRoutes(options).filter(
      (r) =>
        r.primaryText.includes(options.term) ||
        r.secondaryText.includes(options.term) ||
        (r.keywords && r.keywords.includes(options.term)),
    )
  }

  constructor(localization: LocalizationService) {
    this.localizationValues = localization.currentValues.getValue().navigationCommandProvider
  }
}
