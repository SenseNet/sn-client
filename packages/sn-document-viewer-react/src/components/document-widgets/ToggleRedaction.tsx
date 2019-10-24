import PictureInPicture from '@material-ui/icons/PictureInPicture'
import React from 'react'
import { useLocalization, useViewerState } from '../../hooks'
import { ToggleBase } from './ToggleBase'

/**
 * Document widget component to toggleing redaction
 */
export const ToggleRedactionWidget: React.FC = () => {
  const localization = useLocalization()
  const viewerState = useViewerState()

  return (
    <ToggleBase
      isVisible={viewerState.showRedaction}
      title={localization.toggleRedaction}
      setValue={v => viewerState.updateState({ showRedaction: v })}>
      <PictureInPicture />
    </ToggleBase>
  )
}
