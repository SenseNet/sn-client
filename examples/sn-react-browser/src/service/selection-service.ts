import { Injectable } from '@furystack/inject'
import { Disposable, ObservableValue } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'

/**
 * A context service to get/set the active item and the selection
 */
@Injectable({ lifetime: 'singleton' })
export class SelectionService implements Disposable {
  public activeContent = new ObservableValue<GenericContent | undefined>(undefined)
  public selection = new ObservableValue<GenericContent[]>([])

  public async dispose() {
    this.activeContent.dispose()
    this.selection.dispose()
  }
}
