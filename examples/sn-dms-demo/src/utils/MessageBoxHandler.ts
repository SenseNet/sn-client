import { Repository } from '@sensenet/client-core'
import { EventHub } from '@sensenet/repository-events'
import * as DMSActions from '../Actions'

enum MessageMode { error = 'error', warning = 'warning', info = 'info' }

export class MessageBoxHandler {
    private eventHub: EventHub
    constructor(repo: Repository, store) {
        this.eventHub = new EventHub(repo)

        this.eventHub.onContentDeleteFailed.subscribe((response) => {
            store.dispatch(
                DMSActions.openMessageBar(MessageMode.error, { message: response.error.message }),
            )
        })

        this.eventHub.onContentDeleted.subscribe(() => {
            store.dispatch(
                DMSActions.openMessageBar(MessageMode.info, { message: 'Delete was successful' }),
            )
        })
    }
}
