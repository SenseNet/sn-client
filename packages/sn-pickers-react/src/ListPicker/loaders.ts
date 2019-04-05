import { ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'

interface LoadOptions<T> {
  repository: Repository
  oDataOptions?: ODataParams<T>
}
interface LoadItemsOptions<T> extends LoadOptions<T> {
  path: string
}

interface LoadParentOptions<T> extends LoadOptions<T> {
  id?: number
}

/**
 * Loads the picker items from the repository.
 */
export const loadItems = async <T extends GenericContent>({
  path,
  repository,
  oDataOptions: oDataOptionsArgs,
}: LoadItemsOptions<T>) => {
  const defaultODataOptions: ODataParams<T> = {
    select: ['DisplayName', 'Path', 'Id'],
    filter: "(isOf('Folder') and not isOf('SystemFolder'))",
    metadata: 'no',
    orderby: 'DisplayName',
  }
  const oDataOptions = { ...defaultODataOptions, ...oDataOptionsArgs }
  const result = await repository.loadCollection<T>({
    path,
    oDataOptions,
  })
  return result.d.results
}

/**
 * Loads the parent of item of the picker.
 */
export const loadParent = async <T extends GenericContent>({
  id,
  repository,
  oDataOptions: oDataOptionsArgs,
}: LoadParentOptions<T>) => {
  if (!id) {
    return undefined
  }
  const defaultODataOptions: ODataParams<T> = {
    select: ['DisplayName', 'Path', 'Id', 'ParentId', 'Workspace'],
    expand: ['Workspace'],
    metadata: 'no',
  }
  const oDataOptions = { ...defaultODataOptions, ...oDataOptionsArgs }
  const result = await repository.load<T>({
    idOrPath: id as number,
    oDataOptions,
  })
  return result.d
}
