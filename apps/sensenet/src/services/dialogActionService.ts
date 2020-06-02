import { Disposable, Injectable, Injector, ObservableValue, ScopedLogger } from '@sensenet/client-utils'
import { ActionNameType } from '../components/react-control-mapper'

/**
 * A context service to get/set the active item and the selection
 */
@Injectable({ lifetime: 'singleton' })
export class DialogActionService implements Disposable {
  public activeAction = new ObservableValue<ActionNameType>(undefined)
  public contentTypeNameForNewContent = new ObservableValue<string | undefined>(undefined)

  private logger: ScopedLogger

  public async dispose() {
    this.activeAction.dispose()
  }

  constructor(injector: Injector) {
    this.logger = injector.logger.withScope('DialogActionService')

    this.activeAction.subscribe((activeAction) =>
      this.logger.verbose({
        message: activeAction ? `Active action changed to ${activeAction}` : `Active action set to None`,
        data: {
          relatedContent: activeAction,
        },
      }),
    )

    this.contentTypeNameForNewContent.subscribe((contentTypeName) =>
      this.logger.verbose({
        message: contentTypeName ? `Content type name changed to ${contentTypeName}` : `Content type name set to None`,
        data: {
          relatedContent: contentTypeName,
        },
      }),
    )
  }
}
