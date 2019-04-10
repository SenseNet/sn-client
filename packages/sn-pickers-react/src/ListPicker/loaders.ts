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
 * Default loadItems OData options.
 */
export const defaultLoadItemsODataOptions: ODataParams<GenericContent> = {
  select: ['DisplayName', 'Path', 'Id'],
  filter: "(isOf('Folder') and not isOf('SystemFolder'))",
  metadata: 'no',
  orderby: 'DisplayName',
}

/**
 * Loads the picker items from the repository.
 */
export const loadItems = async <T extends GenericContent>({
  path,
  repository,
  oDataOptions: oDataOptionsArgs,
}: LoadItemsOptions<T>) => {
  const oDataOptions = { ...defaultLoadItemsODataOptions, ...oDataOptionsArgs }
  const result = await repository.loadCollection<T>({
    path,
    oDataOptions,
  })
  return result.d.results
}

/**
 * Default loadParent Odata options.
 */
export const defaultLoadParentODataOptions: ODataParams<GenericContent> = {
  select: ['DisplayName', 'Path', 'Id', 'ParentId', 'Workspace'],
  expand: ['Workspace'],
  metadata: 'no',
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
  const oDataOptions = { ...defaultLoadParentODataOptions, ...oDataOptionsArgs }
  const result = await repository.load<T>({
    idOrPath: id as number,
    oDataOptions,
  })
  return result.d
}
