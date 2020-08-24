/**
 * @module ViewControls
 */
import React from 'react'
import { EditView, EditViewProps } from './EditView'

/**
 * Interface for NewView properties
 */
type NewViewProps = EditViewProps

/**
 * View Control for adding a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <NewView contentTypeName={'Folder'} repository={repository} onSubmit={createSubmitClick} />
 * ```
 */
export const NewView: React.FC<NewViewProps> = (props) => {
  const actionName = props.actionName || 'new'

  return <EditView {...props} actionName={actionName} />
}
