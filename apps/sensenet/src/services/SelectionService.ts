import { Injectable, Injector } from '@furystack/inject'
import { Disposable, ObservableValue, ScopedLogger } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'

/**
 * A context service to get/set the active item and the selection
 */
@Injectable({ lifetime: 'singleton' })
export class SelectionService implements Disposable {
  public activeContent = new ObservableValue<GenericContent | undefined>(undefined)
  public selection = new ObservableValue<GenericContent[]>([])

  private logger: ScopedLogger

  public async dispose() {
    this.activeContent.dispose()
    this.selection.dispose()
  }

  constructor(injector: Injector) {
    this.logger = injector.logger.withScope('SelectionService')

    this.activeContent.subscribe(ac =>
      this.logger.verbose({
        message: ac ? `Active content changed to ${ac.DisplayName || ac.Name}` : `Active content set to None`,
        data: {
          relatedContent: ac,
        },
      }),
    )
    this.selection.subscribe(sel => {
      this.logger.verbose({
        message: sel.length
          ? `Selection changed to: ${sel.map(s => s.DisplayName || s.Name).join(', ')}`
          : `Selection cleared`,
      })
    })
  }
}
