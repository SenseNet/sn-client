import type { Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import type { OnExecuteActionPayload } from './CommandProviders/CustomActionCommandProvider'

export const executeCustomAction = async (repo: Repository, actionValue: OnExecuteActionPayload, postBody: string) => {
  switch (actionValue.action.Name) {
    case 'Load':
      return await repo.load({ idOrPath: actionValue.content.Id, oDataOptions: { select: 'all' } })
    case 'LoadCollection':
      return await repo.loadCollection({ path: actionValue.content.Path })
    case 'Create': {
      const parsedBody = JSON.parse(postBody) as { contentType: string; content: object }
      return await repo.post({
        contentType: parsedBody.contentType,
        parentPath: actionValue.content.IsFolder
          ? actionValue.content.Path
          : PathHelper.getParentPath(actionValue.content.Path),
        content: parsedBody.content,
      })
    }
    case 'Remove': {
      const { permanent } = JSON.parse(postBody)
      return await repo.delete({
        idOrPath: actionValue.content.Id,
        permanent: permanent == null ? false : permanent,
      })
    }
    case 'Update':
      return await repo.patch({ idOrPath: actionValue.content.Id, content: JSON.parse(postBody).content })
    default:
      return await repo.executeAction({
        idOrPath: actionValue.content.Id,
        body: JSON.parse(postBody),
        method: actionValue.method,
        name: actionValue.action.Name,
      })
  }
}
