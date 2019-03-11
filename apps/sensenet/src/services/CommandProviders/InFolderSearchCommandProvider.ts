import { Injectable, Injector } from '@furystack/inject'
import { ConstantContent, Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { Query } from '@sensenet/query'
import { CommandPaletteItem } from '../../store/CommandPalette'
import { CommandProvider } from '../CommandProviderManager'
import { ContentContextProvider } from '../ContentContextProvider'

@Injectable()
export class InFolderSearchCommandProvider implements CommandProvider {
  constructor(private readonly injector: Injector) {}

  public shouldExec(searchTerm: string): boolean {
    return searchTerm[0] === '/'
  }

  public async getItems(path: string, repo: Repository): Promise<CommandPaletteItem[]> {
    const currentPath = PathHelper.trimSlashes(path)
    const segments = currentPath.split('/')
    const parentPath = PathHelper.trimSlashes(
      PathHelper.joinPaths(...segments.slice(0, segments.length - 1)) || currentPath,
    )
    const result = await repo.loadCollection<GenericContent>({
      path: ConstantContent.PORTAL_ROOT.Path,
      oDataOptions: {
        query: new Query(q =>
          q
            .inFolder(`/${currentPath}`)
            .or.query(sub => sub.inFolder(`/${parentPath}`).and.equals('Path', `/${currentPath}*`))
            .sort('Path'),
        ).toString(),
        top: 10,
        select: 'all',
      },
    })
    return result.d.results.map(content => ({
      primaryText: content.DisplayName || content.Name,
      secondaryText: content.Path,
      content,
      url: this.injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(content, repo),
    }))
  }
}
