import { Injectable } from '@furystack/inject'
import { Repository } from '@sensenet/client-core'
import { CommandPaletteItem } from '../../store/CommandPalette'
import { CommandProvider } from '../CommandProviderManager'
import { LocalizationService } from '../LocalizationService'

@Injectable({ lifetime: 'transient' })
export class NavigationCommandProvider implements CommandProvider {
  public getRoutes: () => CommandPaletteItem[] = () => [
    {
      primaryText: this.localizationValues.personalSettingsPrimary,
      url: '/personalSettings',
      secondaryText: this.localizationValues.personalSettingsSecondary,
      content: { Type: 'Settings' } as any,
    },
    {
      primaryText: this.localizationValues.contentPrimary,
      url: '/:repo/browse/',
      secondaryText: this.localizationValues.contentSecondary,
      content: { Type: 'PortalRoot' },
    },
    {
      primaryText: this.localizationValues.searchPrimary,
      url: '/:repo/search/',
      secondaryText: this.localizationValues.searchSecondaryText,
      content: { Type: 'Search' },
    },
    {
      primaryText: this.localizationValues.eventsPrimary,
      url: '/events/',
      secondaryText: this.localizationValues.eventsSecondary,
      content: { Type: 'EventLog' },
    },
  ]
  private localizationValues: ReturnType<LocalizationService['currentValues']['getValue']>['navigationCommandProvider']

  public shouldExec(term: string) {
    const termLowerCase = term.toLocaleLowerCase()
    return (
      term.length > 0 &&
      this.getRoutes().find(
        r => r.primaryText.toLocaleLowerCase().includes(termLowerCase) || r.secondaryText.includes(termLowerCase),
      ) !== undefined
    )
  }

  public async getItems(term: string, repo: Repository): Promise<CommandPaletteItem[]> {
    return this.getRoutes()
      .filter(r => r.primaryText.includes(term) || r.secondaryText.includes(term))
      .map(r => ({
        ...r,
        url: r.url.replace('/:repo/', `/${btoa(repo.configuration.repositoryUrl)}/`),
      }))
  }

  /**
   *
   */
  constructor(localization: LocalizationService) {
    this.localizationValues = localization.currentValues.getValue().navigationCommandProvider
  }
}
