import { ActionModel, File, GenericContent } from '@sensenet/default-content-types'
import { useRepository } from './use-repository'

/**
 * Returns if the current content can be opened in WOPI for read or write.
 * @param content The content to check
 */
export const useWopi = (content: GenericContent) => {
  const repo = useRepository()

  const isWriteAwailable =
    repo.schemas.isContentFromType(content, File) &&
    content.Actions &&
    (content.Actions as ActionModel[]).length > 0 &&
    (content.Actions as ActionModel[]).find(a => a.Name === 'WopiOpenEdit')

  const isReadAwailable =
    isWriteAwailable ||
    (repo.schemas.isContentFromType(content, File) &&
      content.Actions &&
      (content.Actions as ActionModel[]).length > 0 &&
      (content.Actions as ActionModel[]).find(a => a.Name === 'WopiOpenView'))

  return {
    /**
     * The file can be opened for read with WOPI
     */
    isReadAwailable,
    /**
     * The file can be opened for write with WOPI
     */
    isWriteAwailable,
  }
}
