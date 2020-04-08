import { GenericContent, isActionModel } from '@sensenet/default-content-types'
import { useCallback } from 'react'
import { useRepository } from './use-repository'

/**
 * Returns two functions that can determine if the current content can be opened in WOPI for read or write.
 * In order to work this correctly, you need to get Actions field in the content.
 */
export const useWopi = () => {
  const repo = useRepository()

  const isWriteAvailable = useCallback(
    (content: GenericContent) =>
      repo.schemas.isContentFromType(content, 'File') &&
      isActionModel(content.Actions) &&
      content.Actions.some((action) => action.Name === 'WopiOpenEdit' && !action.Forbidden),
    [repo.schemas],
  )

  const isReadAvailable = useCallback(
    (content: GenericContent) =>
      isWriteAvailable(content) ||
      (repo.schemas.isContentFromType(content, 'File') &&
        isActionModel(content.Actions) &&
        content.Actions.some((action) => action.Name === 'WopiOpenView' && !action.Forbidden)),
    [isWriteAvailable, repo.schemas],
  )

  return {
    /**
     * The file can be opened for read with WOPI
     */
    isReadAvailable,
    /**
     * The file can be opened for write with WOPI
     */
    isWriteAvailable,
  }
}
