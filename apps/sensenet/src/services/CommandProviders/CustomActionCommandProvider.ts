import { MetadataAction, ODataResponse, Repository } from '@sensenet/client-core'
import { Injectable, ObservableValue } from '@sensenet/client-utils'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { CommandProvider, SearchOptions } from '../CommandProviderManager'
import { LocalizationService } from '../LocalizationService'
import { SelectionService } from '../SelectionService'

export interface OnExecuteActionPayload {
  content: GenericContent
  action: ActionModel
  metadata?: MetadataAction
  method: 'GET' | 'POST'
}

@Injectable({ lifetime: 'singleton' })
export class CustomActionCommandProvider implements CommandProvider {
  public onExecuteAction = new ObservableValue<OnExecuteActionPayload>()

  public onActionExecuted = new ObservableValue<{ content: GenericContent; action: ActionModel; response: any }>()

  public shouldExec(options: SearchOptions) {
    return this.selectionService.activeContent.getValue() &&
      options.term &&
      options.term.length > 2 &&
      options.term.startsWith('>')
      ? true
      : false
  }

  private contentWithActionsAndMetadata: ODataResponse<GenericContent> | undefined

  private async getActions(id: number, repository: Repository) {
    if (this.contentWithActionsAndMetadata && id === this.contentWithActionsAndMetadata.d.Id) {
      return this.contentWithActionsAndMetadata
    }
    const result = await repository.load<GenericContent>({
      idOrPath: id,
      oDataOptions: {
        metadata: 'full',
        expand: ['Actions'],
        select: ['Actions'],
      },
    })
    this.contentWithActionsAndMetadata = result
    return result
  }

  public async getItems(options: SearchOptions) {
    const content = this.selectionService.activeContent.getValue()
    const localization = this.localization.currentValues.getValue().commandPalette.customAction
    const filteredTerm = options.term.substr(1).toLowerCase()
    if (!content) {
      return []
    }

    const { d: contentWithActions } = await this.getActions(content.Id, options.repository)

    return (contentWithActions.Actions as ActionModel[])
      .filter(
        a =>
          (a.Name.toLowerCase().includes(filteredTerm) && a.IsODataAction) ||
          (a.DisplayName.toLowerCase().includes(filteredTerm) && a.IsODataAction),
      )
      .map(a => {
        const actionMetadata =
          contentWithActions.__metadata &&
          contentWithActions.__metadata.actions &&
          contentWithActions.__metadata.actions.find(action => action.name === a.Name)

        const functionMetadata =
          contentWithActions.__metadata &&
          contentWithActions.__metadata.functions &&
          contentWithActions.__metadata.functions.find(fn => fn.name === a.Name)

        // merge custom parameters to function metadata
        const customActionMetadata = functionMetadata && {
          ...functionMetadata,
          ...this.addParametersForCustomActions(a),
        }

        return {
          primaryText: localization.executePrimaryText
            .replace('{0}', content.DisplayName || content.Name)
            .replace('{1}', a.DisplayName || a.Name),
          secondaryText: localization.executeSecondaryText.replace('{0}', content.Name).replace('{1}', a.Name),
          content,
          hits: [filteredTerm],
          url: '',
          openAction: () =>
            this.onExecuteAction.setValue({
              action: a,
              content,
              metadata: actionMetadata || customActionMetadata,
              method: actionMetadata ? 'POST' : 'GET',
            }),
        }
      })
  }

  constructor(
    private readonly selectionService: SelectionService,
    private readonly localization: LocalizationService,
  ) {}

  private addParametersForCustomActions(action: ActionModel) {
    switch (action.Name) {
      case 'Create':
        return {
          parameters: [
            { name: 'contentType', type: 'string', required: true },
            { name: 'content', type: 'object', required: true },
          ],
        }
      case 'Update':
        return { parameters: [{ name: 'content', type: 'object', required: true }] }
      case 'Remove':
        return { parameters: [{ name: 'permanent', type: 'boolean', required: false }] }
      default:
        return
    }
  }
}
