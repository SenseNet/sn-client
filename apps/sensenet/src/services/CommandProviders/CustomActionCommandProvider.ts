import { Injectable } from '@furystack/inject'
import { Repository } from '@sensenet/client-core'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { CommandPaletteItem } from '../../store/CommandPalette'
import { CommandProvider } from '../CommandProviderManager'
import { SelectionService } from '../SelectionService'

@Injectable({ lifetime: 'singleton' })
export class CustomActionCommandProvider implements CommandProvider {
  public shouldExec(term: string) {
    return this.selectionService.activeContent.getValue() && term.length > 2 && term.startsWith('>') ? true : false
  }
  public async getItems(_term: string, repo: Repository) {
    const content = this.selectionService.activeContent.getValue()
    const filteredTerm = _term.substr(1).toLowerCase()
    if (!content) {
      return []
    }
    const result = await repo.load<GenericContent>({
      idOrPath: content.Id,
      oDataOptions: {
        metadata: 'full',
        expand: ['Actions'],
        select: ['Actions'],
      },
    })
    const actions = (result.d.Actions as ActionModel[]) || []
    return actions
      .filter(a => a.Name.toLowerCase().includes(filteredTerm))
      .map(
        a =>
          ({
            primaryText: a.DisplayName || a.Name,
            secondaryText: '',
            content: this.selectionService.activeContent.getValue(),
          } as CommandPaletteItem),
      )
  }

  constructor(private readonly selectionService: SelectionService) {}
}
