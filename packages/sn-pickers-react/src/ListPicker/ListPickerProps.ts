import { GenericContent } from '@sensenet/default-content-types'

/**
 * Properties for list picker component.
 * @interface ListPickerProps
 * @template T
 */
export interface ListPickerProps<T extends GenericContent = GenericContent> {
  /**
   * Load content from path.
   * @memberof ListPickerProps
   */
  loadItems: (path: string) => Promise<T[]>

  /**
   * Load parent content.
   * @memberof ListPickerProps
   */
  loadParent: (id?: number) => Promise<T>

  /**
   * Items to render.
   * @type {T[]}
   * @memberof ListPickerProps
   */
  items?: T[]

  /**
   * The current content's path.
   * @type {string}
   * @default '' // - empty string (This will load content under default site)
   * @memberof ListPickerProps
   */
  currentPath?: string

  /**
   * Current parent id.
   * `undefined` value means there isn't a parent. Parent item won't show.
   * @type {number}
   * @memberof ListPickerProps
   */
  parentId?: number

  /**
   * Called before navigation. Can be used to clear the selected state.
   * @memberof ListPickerProps
   */
  onNavigation?: () => void

  /**
   * Called on click with the current item.
   * This is **not** invoked for parent selection!
   * @memberof ListPickerProps
   */
  onSelectionChanged?: (node: T) => void

  /**
   * Render a loading component when loadItems called.
   * @default null
   * @memberof ListPickerProps
   */
  renderLoading?: () => JSX.Element

  /**
   * Render an error component when error happened in loadItems call.
   * @default null
   * @memberof ListPickerProps
   */
  renderError?: (message: string) => JSX.Element

  /**
   * Function to render the item component.
   * @memberof ItemListProps
   * @default const defaultRenderItem = (node: T) => (
   * <ListItem button={true} selected={node.Id === selectedId}>
   *   <ListItemIcon>
   *     <Icon type={iconType.materialui} iconName="folder" />
   *   </ListItemIcon>
   *   <ListItemText primary={node.DisplayName} />
   * </ListItem>
   * )
   */
  renderItem?: (props: T) => JSX.Element
}
