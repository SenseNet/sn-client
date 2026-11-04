import type { MetadataAction, ODataResponse, Repository } from '@sensenet/client-core'
import { Injectable, ObservableValue } from '@sensenet/client-utils'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { CommandProvider, SearchOptions } from '../CommandProviderManager'
import { LocalizationService } from '../LocalizationService'
import { SelectionService } from '../SelectionService'

type ContentWithActionMetadata = GenericContent & {
  __metadata?: {
    actions?: MetadataAction[]
    functions?: MetadataAction[]
  }
}

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
    return this.selectionService.activeContent.getValue() && options.term?.length > 2 && options.term.startsWith('>')
      ? true
      : false
  }

  private contentWithActionsAndMetadata: ODataResponse<ContentWithActionMetadata> | undefined

  private async getActions(id: number, repository: Repository) {
    if (id === this.contentWithActionsAndMetadata?.d.Id) {
      return this.contentWithActionsAndMetadata
    }
    const result = await repository.load<ContentWithActionMetadata>({
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

  public async getODataActionPayloads(
    content: GenericContent,
    repository: Repository,
  ): Promise<OnExecuteActionPayload[]> {
    const { d: contentWithActions } = await this.getActions(content.Id, repository)
    const actions = Array.isArray(contentWithActions.Actions) ? (contentWithActions.Actions as ActionModel[]) : []

    return actions
      .filter((action) => action.IsODataAction && !action.Forbidden)
      .map((action) => this.getActionPayload(content, contentWithActions, action))
  }

  public async getItems(options: SearchOptions) {
    const content = this.selectionService.activeContent.getValue()
    const localization = this.localization.currentValues.getValue().commandPalette.customAction
    const filteredTerm = options.term.substr(1).toLowerCase()
    if (!content) {
      return []
    }

    return (await this.getODataActionPayloads(content, options.repository))
      .filter(
        ({ action }) =>
          action.Name.toLowerCase().includes(filteredTerm) ||
          (action.DisplayName || action.Name).toLowerCase().includes(filteredTerm),
      )
      .map((actionValue) => {
        return {
          primaryText: localization.executePrimaryText
            .replace('{0}', content.DisplayName || content.Name)
            .replace('{1}', actionValue.action.DisplayName || actionValue.action.Name),
          secondaryText: localization.executeSecondaryText
            .replace('{0}', content.Name)
            .replace('{1}', actionValue.action.Name),
          parameters: actionValue.action.ActionParameters,
          content,
          hits: [filteredTerm],
          url: '',
          openAction: () => this.onExecuteAction.setValue(actionValue),
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

  private getActionPayload(
    content: GenericContent,
    contentWithActions: ContentWithActionMetadata,
    action: ActionModel,
  ): OnExecuteActionPayload {
    const actionMetadata = contentWithActions.__metadata?.actions?.find(
      (metadataAction) => metadataAction.opId === action.OpId,
    )
    const functionMetadata = contentWithActions.__metadata?.functions?.find((fn) => fn.opId === action.OpId)

    const customActionMetadata = functionMetadata && {
      ...functionMetadata,
      ...this.addParametersForCustomActions(action),
    }

    return {
      action,
      content,
      metadata: actionMetadata || customActionMetadata,
      method: actionMetadata ? 'POST' : 'GET',
    }
  }
}
