import BrandingWatermark from '@material-ui/icons/BrandingWatermark'
import React from 'react'
import { useLocalization, useViewerState } from '../../hooks'
import { ToggleBase } from './ToggleBase'

/**
 * Document widget component that toggles the displaying of the watermark
 */
export const ToggleWatermarkWidget: React.FC = () => {
  const localization = useLocalization()
  const viewerState = useViewerState()
  return (
    <ToggleBase
      title={localization.toggleWatermark}
      isVisible={viewerState.showWatermark}
      setValue={v => viewerState.updateState({ showWatermark: v })}>
      <BrandingWatermark />
    </ToggleBase>
  )
}
