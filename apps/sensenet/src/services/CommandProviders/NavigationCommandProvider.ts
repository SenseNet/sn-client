import { Injectable } from '@furystack/inject'
import { Repository } from '@sensenet/client-core'
import { CommandPaletteItem } from '../../store/CommandPalette'
import { CommandProvider } from '../CommandProviderManager'

@Injectable({ lifetime: 'singleton' })
export class NavigationCommandProvider implements CommandProvider {
  public routes: CommandPaletteItem[] = [
    {
      primaryText: 'Personal Settings',
      url: '/personalSettings',
      secondaryText: 'Edit your personal settings',
      content: { Type: 'Settings' } as any,
    },
    { primaryText: 'Content', url: '/:repo/browse/', secondaryText: 'Explore the content of the Repository' },
    { primaryText: 'Search', url: '/:repo/search/', secondaryText: 'Search in the repository, manage content queries' },
  ]

  public shouldExec(term: string) {
    return (
      term.length > 0 &&
      this.routes.find(r => r.primaryText.includes(term) || r.secondaryText.includes(term)) !== undefined
    )
  }

  public async getItems(term: string, repo: Repository): Promise<CommandPaletteItem[]> {
    return this.routes
      .filter(r => r.primaryText.includes(term) || r.secondaryText.includes(term))
      .map(r => ({
        ...r,
        url: r.url.replace('/:repo/', `/${btoa(repo.configuration.repositoryUrl)}/`),
      }))
  }
}
