import { ActionModel } from '@sensenet/default-content-types'

export interface CallableActionModel extends ActionModel {
  Action?: () => void
}

export const isCallableAction = (action: ActionModel): action is Required<CallableActionModel> => {
  if ((action as CallableActionModel).Action) {
    if (typeof (action as CallableActionModel).Action === 'function') return true
  }
  return false
}
