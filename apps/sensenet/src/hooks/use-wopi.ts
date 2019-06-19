import { GenericContent, File, ActionModel } from '@sensenet/default-content-types'
import { isContentFromType } from '../utils/isContentFromType'
import { useRepository } from './use-repository'
export const useWopi = (content: GenericContent) => {
  const repo = useRepository()

  const isWriteAwailable =
    isContentFromType(content, File, repo.schemas) &&
    content.Actions &&
    (content.Actions as ActionModel[]).length > 0 &&
    (content.Actions as ActionModel[]).find(a => a.Name === 'WopiOpenEdit')

  const isReadAwailable =
    isWriteAwailable ||
    (isContentFromType(content, File, repo.schemas) &&
      content.Actions &&
      (content.Actions as ActionModel[]).length > 0 &&
      (content.Actions as ActionModel[]).find(a => a.Name === 'WopiOpenView'))

  return {
    isReadAwailable,
    isWriteAwailable,
  }
}
