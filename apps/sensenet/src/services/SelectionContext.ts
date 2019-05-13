import { Injectable } from '@furystack/inject'
import { GenericContent } from '@sensenet/default-content-types'

/**
 * A context service to get/set the active item and the selection
 */
@Injectable({ lifetime: 'singleton' })
export class SelectionContext {
  public activeContent?: GenericContent
  public selection: GenericContent[] = []
}
