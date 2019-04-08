import { ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'

/**
 * Properties for list picker component.
 * @interface ListPickerProps
 * @template T
 */
export interface ListPickerProps<T extends GenericContent = GenericContent> {
  /**
   * Repositry to load contents from.
   * To use the default load options you need to provide a repository.
   * @type {Repository}
   */
  repository: Repository

  /**
   * OData parameters for list items.
   * @default { select: ['DisplayName', 'Path', 'Id'],
   *   filter: "(isOf('Folder') and not isOf('SystemFolder'))",
   *   metadata: 'no',
   *   orderby: 'DisplayName',}
   */
  itemsOdataOptions?: ODataParams<T>

  /**
   * OData parameters for the parent list item.
   * @default {
   *   select: ['DisplayName', 'Path', 'Id', 'ParentId', 'Workspace'],
   *   expand: ['Workspace'],
   *   metadata: 'no',
   * }
   */
  parentODataOptions?: ODataParams<T>

  /**
   * The current content's path.
   * @type {string}
   * @default '' // - empty string (This will load content under default site)
   */
  currentPath?: string

  /**
   * Current parent id.
   * `undefined` value means there isn't a parent. Parent item won't show.
   * @type {number}
   */
  parentId?: number

  /**
   * Called before navigation. Can be used to clear the selected state.
   */
  onNavigation?: () => void

  /**
   * Called on click with the current item.
   * This is **not** invoked for parent selection!
   */
  onSelectionChanged?: (node: T) => void

  /**
   * Render a loading component when loadItems called.
   * @default null
   */
  renderLoading?: () => JSX.Element

  /**
   * Render an error component when error happened in loadItems call.
   * @default null
   */
  renderError?: (message: string) => JSX.Element

  /**
   * Function to render the item component.
   * @default
   * ```js
   * const defaultRenderItem = (node: T) => (
   * <ListItem button={true} selected={node.Id === selectedId}>
   *   <ListItemIcon>
   *     <Icon type={iconType.materialui} iconName="folder" />
   *   </ListItemIcon>
   *   <ListItemText primary={node.DisplayName} />
   * </ListItem>
   * )
   * ```
   */
  renderItem?: (props: T) => JSX.Element

  /**
   * Debounce milliseconds to prevent multiple reload calls.
   * @default 1000
   */
  debounceMsOnReload?: number
}
