import { Injectable } from '@furystack/inject'
import { CommandProvider, SearchOptions } from '../CommandProviderManager'
import { LocalizationService } from '../LocalizationService'
import { CommandPaletteItem } from '../../hooks'

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
              url: '/personalSettings',
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
          url: '/:repo/browse/',
          secondaryText: this.localizationValues.contentSecondary,
          content: { Type: 'PortalRoot' } as any,
          keywords: 'explore browse repository',
          hits: [term],
        },
        {
          primaryText: this.localizationValues.searchPrimary,
          url: '/:repo/search/',
          secondaryText: this.localizationValues.searchSecondaryText,
          content: { Type: 'Search' } as any,
          keywords: 'search find content query',
          hits: [term],
        },
        {
          primaryText: this.localizationValues.savedQueriesPrimary,
          url: '/:repo/saved-queries/',
          secondaryText: this.localizationValues.savedQueriesSecondaryText,
          content: { Type: 'Search' } as any,
          keywords: 'saved query search find',
          hits: [term],
        },
        {
          primaryText: this.localizationValues.eventsPrimary,
          url: '/events/',
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
    const termLowerCase = options.term.toLocaleLowerCase()
    return (
      options.term.length > 0 &&
      this.getRoutes(options).find(
        r =>
          r.primaryText.toLocaleLowerCase().includes(termLowerCase) ||
          r.secondaryText.includes(termLowerCase) ||
          (r.keywords && r.keywords.includes(termLowerCase) ? true : false),
      ) !== undefined
    )
  }

  public async getItems(options: SearchOptions): Promise<CommandPaletteItem[]> {
    return this.getRoutes(options)
      .filter(
        r =>
          r.primaryText.includes(options.term) ||
          r.secondaryText.includes(options.term) ||
          (r.keywords && r.keywords.includes(options.term)),
      )
      .map(r => ({
        ...r,
        url: r.url.replace('/:repo/', `/${btoa(options.repository.configuration.repositoryUrl)}/`),
      }))
  }

  /**
   *
   */
  constructor(localization: LocalizationService) {
    this.localizationValues = localization.currentValues.getValue().navigationCommandProvider
  }
}
