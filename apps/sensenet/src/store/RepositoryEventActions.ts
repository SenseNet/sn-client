import { GenericContent } from '@sensenet/default-content-types'
import { EventHub } from '@sensenet/repository-events'
import { Store } from 'redux'
import { createAction } from './ActionHelpers'

export const eventHubContentLoaded = createAction((content: GenericContent) => ({
  type: 'eventHubContentLoaded',
  content,
}))

export const eventHubContentModified = createAction((content: GenericContent, changes: GenericContent) => ({
  type: 'eventHubContentModified',
  content,
  changes,
}))

export const eventHubContentModificationFailed = createAction((content: Partial<GenericContent>, error: any) => ({
  type: 'eventHubContentModificationFailed',
  content,
  error,
}))

export const eventHubContentDeleted = createAction((contentData: GenericContent, permanently: boolean) => ({
  type: 'eventHubContentDeleted',
  contentData,
  permanently,
}))
export const eventHubContentDeleteFailed = createAction(
  (content: GenericContent, permanently: boolean, error: any) => ({
    type: 'eventHubContentDeleteFailed',
    content,
    permanently,
    error,
  }),
)

export const eventHubContentCreated = createAction((content: GenericContent) => ({
  type: 'eventHubContentCreated',
  content,
}))
export const eventHubContentCreateFailed = createAction((content: GenericContent, error: any) => ({
  type: 'eventHubContentCreateFailed',
  content,
  error,
}))

export const eventHubContentCopied = createAction(
  (content: GenericContent, originalContent: string | number | Array<string | number>) => ({
    type: 'eventHubContentCopied',
    content,
    originalContent,
  }),
)
export const eventHubContentCopyFailed = createAction((content: GenericContent, error: any) => ({
  type: 'eventHubContentCopyFailed',
  content,
  error,
}))

export const eventHubContentMoved = createAction((content: GenericContent) => ({
  type: 'eventHubContentMoved',
  content,
}))
export const eventHubContentMoveFailed = createAction((content: GenericContent, error: any) => ({
  type: 'eventHubContentMoveFailed',
  content,
  error,
}))

export const subscribeEventsToStore = (store: Store, eventHub: EventHub) => {
  eventHub.onContentCreated.subscribe(c => store.dispatch(eventHubContentCreated(c.content)))
  eventHub.onContentCreateFailed.subscribe(c => store.dispatch(eventHubContentCreateFailed(c.content, c.error)))
  eventHub.onContentLoaded.subscribe(c => store.dispatch(eventHubContentLoaded(c.content)))
  eventHub.onContentModified.subscribe(c => store.dispatch(eventHubContentModified(c.content, c.changes)))
  eventHub.onContentModificationFailed.subscribe(c =>
    store.dispatch(eventHubContentModificationFailed(c.content, c.error)),
  )
  eventHub.onContentDeleted.subscribe(c => store.dispatch(eventHubContentDeleted(c.contentData, c.permanently)))
  eventHub.onContentDeleteFailed.subscribe(c =>
    store.dispatch(eventHubContentDeleteFailed(c.content, c.permanently, c.error)),
  )
  eventHub.onContentCopied.subscribe(c => store.dispatch(eventHubContentCopied(c.content, c.originalContent)))
  eventHub.onContentCopyFailed.subscribe(c => store.dispatch(eventHubContentCopyFailed(c.content, c.error)))

  eventHub.onContentMoved.subscribe(c => store.dispatch(eventHubContentMoved(c.content)))
  eventHub.onContentMoveFailed.subscribe(c => store.dispatch(eventHubContentMoveFailed(c.content, c.error)))
}
