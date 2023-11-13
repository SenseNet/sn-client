import { ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { ReactElement } from 'react'
import { PickerClassKey, PickerModes } from './picker'

export interface PickerLocalization {
  searchPlaceholder?: string
  showSelected?: string
  treeViewButton?: string
  submitButton?: string
  cancelButton?: string
  currentContentText?: string
}

export type TReferemceSelectionHelperPath = Pick<
  GenericContent,
  | 'Id'
  | 'ParentId'
  | 'OwnerId'
  | 'VersionId'
  | 'Icon'
  | 'Name'
  | 'CreatedById'
  | 'ModifiedById'
  | 'Version'
  | 'Path'
  | 'Depth'
  | 'IsSystemContent'
  | 'IsFile'
  | 'IsFolder'
  | 'DisplayName'
  | 'Description'
>

/**
 * Properties for picker component.
 * @interface PickerProps
 * @template T
 */
export interface PickerProps<T> {
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
  itemsODataOptions?: ODataParams<T>

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
   * The context content's path.
   * @type {string}
   * @default '' // - empty string (This will load content under default site)
   */
  contextPath?: string

  /**
   * Roots of subtrees where selection is enabled
   * @type {string}
   */
  selectionRoots?: string[]

  /**
   * List of items which selection are disabled
   * @type {string[]}
   */
  selectionBlacklist?: string[]

  /**
   * Is selection of multiple items enabled?
   * @type {boolean}
   */
  allowMultiple?: boolean

  /**
   * Called on navigation. Can be used to clear the selected state and to know the path
   * of the navigation.
   */
  onTreeNavigation?: (path: string) => void

  /**
   * Called on click with the current item.
   */
  onSelectionChanged?: (nodes: T[]) => void

  /**
   * Render a loading component when loadItems called.
   * @default null
   */
  renderLoading?: () => ReactElement

  /**
   * Render an error component when error happened in loadItems call.
   * @default null
   */
  renderError?: (message: string) => ReactElement

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
  renderItem?: (props: T) => ReactElement<T>

  /**
   * Function to render the icon of items.
   */
  renderIcon?: (props: T) => ReactElement<T>

  /**
   * Function to render the action buttons.
   */
  renderActions?: (currentSelection: T[]) => ReactElement<T>

  /**
   * Function which called is on the Cancel button click.
   */
  handleCancel?: () => void

  /**
   * Function which is called on the Submit button click.
   */
  handleSubmit?: (selection: T[]) => void

  /**
   * Is submit execution in progress?
   * @type {boolean}
   */
  isExecInProgress?: boolean

  /**
   * Container element of the picker
   * @default div
   */
  pickerContainer?: React.ElementType

  /**
   * Container element of the action buttons
   * @default div
   */
  actionsContainer?: React.ElementType

  /**
   * Localization object for UI labels and texts
   * @type {PickerLocalization}
   */
  localization?: PickerLocalization

  /**
   * Default selection
   * @type {GenericContent[]}
   */
  defaultValue?: GenericContent[]

  /**
   * Minimum number of items for a valid selection
   */
  required?: number

  classes?: PickerClassKey

  setDestination?: React.Dispatch<React.SetStateAction<string | undefined>>

  currentParent?: GenericContent

  treePickerMode?: PickerModes.TREE | PickerModes.COPY_MOVE_TREE

  navigationPath?: string
  setNavigationPath?: React.Dispatch<React.SetStateAction<string>>
  getReferencePickerHelperData?: () => Promise<any[]>
}
