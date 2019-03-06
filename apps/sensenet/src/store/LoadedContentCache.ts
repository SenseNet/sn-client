import { GenericContent } from '@sensenet/default-content-types'
import { Reducer } from 'redux'
import { isFromAction } from './ActionHelpers'
import {
  eventHubContentCopied,
  eventHubContentCreated,
  eventHubContentDeleted,
  eventHubContentLoaded,
  eventHubContentModified,
  eventHubContentMoved,
} from './RepositoryEventActions'

export const loadedContentCache: Reducer<GenericContent[]> = (state = [], action) => {
  if (
    isFromAction(action, eventHubContentLoaded) ||
    isFromAction(action, eventHubContentModified) ||
    isFromAction(action, eventHubContentMoved)
  ) {
    return state.find(item => item.Id === action.content.Id)
      ? state.map(item => (item.Id === action.content.Id ? action.content : item))
      : [...state, action.content]
  } else if (isFromAction(action, eventHubContentDeleted)) {
    return state.filter(item => item.Id !== action.contentData.Id)
  } else if (isFromAction(action, eventHubContentCopied) || isFromAction(action, eventHubContentCreated)) {
    return [...state, action.content]
  }
  return state
}
