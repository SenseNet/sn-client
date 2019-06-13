import Comment from '@material-ui/icons/Comment'
import React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, showComments } from '../../store'
import { ToggleBase } from './ToggleBase'

/**
 * Represents a comment toggler component
 */
export function ToggleComments(props: CommentProps) {
  return (
    <ToggleBase {...props}>
      <Comment />
    </ToggleBase>
  )
}

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    isVisible: state.sensenetDocumentViewer.viewer.showComments,
    title: state.sensenetDocumentViewer.localization.toggleComments,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  setValue: showComments,
}

type CommentProps = componentType<typeof mapStateToProps, typeof mapDispatchToProps>

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleComments)

export { connectedComponent as ToggleCommentsWidget }
