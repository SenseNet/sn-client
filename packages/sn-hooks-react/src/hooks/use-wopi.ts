import { ActionModel, File, GenericContent } from '@sensenet/default-content-types'
import { useRepository } from './use-repository'
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
    isReadAwailable,
    isWriteAwailable,
  }
}
