import { Injectable } from '@furystack/inject'
import { MetadataAction, Repository } from '@sensenet/client-core'
import { ObservableValue } from '@sensenet/client-utils'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { CommandPaletteItem } from '../../store/CommandPalette'
import { CommandProvider } from '../CommandProviderManager'
import { LocalizationService } from '../LocalizationService'
import { SelectionService } from '../SelectionService'

@Injectable({ lifetime: 'singleton' })
export class CustomActionCommandProvider implements CommandProvider {
  public onExecuteAction = new ObservableValue<{
    content: GenericContent
    action: ActionModel
    metadata?: MetadataAction
    method: 'GET' | 'POST'
  }>()

  public onActionExecuted = new ObservableValue<{ content: GenericContent; action: ActionModel; response: any }>()

  public shouldExec(term: string) {
    return this.selectionService.activeContent.getValue() && term.length > 2 && term.startsWith('>') ? true : false
  }
  public async getItems(_term: string, repo: Repository) {
    const content = this.selectionService.activeContent.getValue()
    const localization = this.localization.currentValues.getValue().commandPalette.customAction
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
      .filter(a => a.Name.toLowerCase().includes(filteredTerm) || a.DisplayName.toLowerCase().includes(filteredTerm))
      .map(a => {
        const actionMetadata =
          result.d.__metadata &&
          result.d.__metadata.actions &&
          result.d.__metadata.actions.find(action => action.name === a.Name)

        const functionMetadata =
          result.d.__metadata &&
          result.d.__metadata.functions &&
          result.d.__metadata.functions.find(fn => fn.name === a.Name)

        return {
          primaryText: localization.executePrimaryText
            .replace('{0}', content.DisplayName || content.Name)
            .replace('{1}', a.DisplayName || a.Name),
          secondaryText: localization.executeSecondaryText.replace('{0}', content.Name).replace('{1}', a.Name),
          content,
          hits: [filteredTerm],
          openAction: () =>
            this.onExecuteAction.setValue({
              action: a,
              content,
              metadata: actionMetadata || functionMetadata,
              method: actionMetadata ? 'POST' : 'GET',
            }),
        } as CommandPaletteItem
      })
  }

  constructor(
    private readonly selectionService: SelectionService,
    private readonly localization: LocalizationService,
  ) {}
}
