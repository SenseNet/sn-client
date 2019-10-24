import Dashboard from '@material-ui/icons/Dashboard'
import React from 'react'
import { useLocalization, useViewerState } from '../../hooks'
import { ToggleBase } from './ToggleBase'

/**
 * Document widget component that toggles the displaying of the shapes
 */
export const ToggleShapesWidget: React.FC = () => {
  const localization = useLocalization()
  const viewerState = useViewerState()

  return (
    <ToggleBase
      isVisible={viewerState.showShapes}
      title={localization.toggleShapes}
      setValue={v => viewerState.updateState({ showShapes: v })}>
      <Dashboard />
    </ToggleBase>
  )
}
