/**
 * @module ViewControls
 *
 * @preferred
 * @description This module contains controls that displays a full content in a specific way
 *
 */ /** */

import { Reducers } from '@sensenet/redux'

export { EditView } from './EditView'
export { NewView } from './NewView'
export { BrowseView } from './BrowseView'
/**
 * Interface for root state type
 */
export interface RootStateType { sensenet: ReturnType<typeof Reducers.sensenet> }
