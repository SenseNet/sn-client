import { ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'

export const contextMenuODataOptions: ODataParams<GenericContent> = {
  select: ['Actions'],
  metadata: 'full',
  expand: ['Actions'],
  scenario: 'ContextMenu',
}
