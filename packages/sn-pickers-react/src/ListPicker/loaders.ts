import { ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { GenericContentWithIsParent } from './types'

interface LoadItemsOptions<T> {
  path: string
  parentId?: number
  repository: Repository
  itemsODataOptions?: ODataParams<T>
  parentODataOptions?: ODataParams<T>
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
 * Default loadParent Odata options.
 */
export const defaultLoadParentODataOptions: ODataParams<GenericContent> = {
  select: ['DisplayName', 'Path', 'Id', 'ParentId'],
  metadata: 'no',
}

/**
 *  Loads the content of the passed in parentId or gets the parent of the item prop
 * @template T
 * @param {T} item
 * @param {Repository} repository
 * @param {ODataParams<T>} [parentODataOptionsArgs]
 * @param {number} [parentId]
 * @returns the parent content
 */
async function getParent<T extends GenericContent>(
  item: T,
  repository: Repository,
  parentODataOptionsArgs?: ODataParams<T>,
  parentId?: number,
) {
  // We don't want to query with 0
  if (parentId === 0) {
    return
  }
  const parentODataOptions = { ...defaultLoadParentODataOptions, ...parentODataOptionsArgs }
  if (parentId == null && item.ParentId) {
    // We need the parent's parent
    const itemParent = await repository.load<T>({
      idOrPath: item.ParentId,
      oDataOptions: parentODataOptions,
    })
    return await repository.load<T>({ idOrPath: itemParent.d.ParentId!, oDataOptions: parentODataOptions })
  }
  return await repository.load<T>({
    idOrPath: parentId!,
    oDataOptions: parentODataOptions,
  })
}

/**
 * Loads the picker items from the repository.
 */
export const loadItems = async <T extends GenericContentWithIsParent>({
  path,
  repository,
  itemsODataOptions: itemsODataOptionsArgs,
  parentODataOptions,
  parentId,
}: LoadItemsOptions<T>) => {
  const itemsODataOptions = { ...defaultLoadItemsODataOptions, ...itemsODataOptionsArgs }
  const itemsResult = await repository.loadCollection<T>({
    path,
    oDataOptions: itemsODataOptions,
  })
  const items = itemsResult.d.results.map(item => {
    return { ...item, isParent: false }
  })
  const parentResult = await getParent<T>(items[0], repository, parentODataOptions, parentId)
  if (!parentResult) {
    return items
  }
  return [{ ...parentResult.d, isParent: true }, ...items]
}
