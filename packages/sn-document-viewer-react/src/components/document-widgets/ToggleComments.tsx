import Comment from '@material-ui/icons/Comment'
import React from 'react'
import { useLocalization, useViewerState } from '../../hooks'
import { ToggleBase } from './ToggleBase'

/**
 * Represents a comment toggler component
 */
export const ToggleCommentsWidget: React.FC = () => {
  const localization = useLocalization()
  const viewerState = useViewerState()
  return (
    <ToggleBase
      isVisible={viewerState.showComments}
      title={localization.toggleComments}
      setValue={v => viewerState.updateState({ showComments: v })}>
      <Comment color="action" fill={viewerState.showComments ? '#ffffff' : '#ffffff'} />
    </ToggleBase>
  )
}
