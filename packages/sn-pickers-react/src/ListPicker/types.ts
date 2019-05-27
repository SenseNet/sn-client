import { GenericContent } from '@sensenet/default-content-types'

/**
 * useListPicker state
 */
export interface State<T> {
  selectedItem: T | undefined
  path: string
  parentId: number | undefined
}

/**
 * SelectAction's type
 */
export const SET_SELECTED_ITEM = 'SET_SELECTED_ITEM'

/**
 * NavigateToAction's type
 */
export const NAVIGATE_TO = 'NAVIGATE_TO'

/**
 * Union type of SelectAction & NavigateToAction
 */
export type Action<T> = SelectAction<T> | NavigateToAction<T>

/**
 * Select action interface
 */
export interface SelectAction<T> {
  type: typeof SET_SELECTED_ITEM
  payload?: T
}

/**
 * Navigate to action interface
 */
export interface NavigateToAction<T = GenericContent> {
  type: typeof NAVIGATE_TO
  payload: {
    node: T
    parent?: T
  }
}

/**
 * Generic content with isParent property
 */
export type GenericContentWithIsParent = GenericContent & { isParent?: boolean }
