import IconButton from '@material-ui/core/IconButton'
import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'

import React, { useCallback } from 'react'
import { PreviewImageData } from '../../models'
import { RootReducerType, rotateImages } from '../../store'
import { useLocalization, useViewerState } from '../../hooks'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    pages: state.sensenetDocumentViewer.previewImages.AvailableImages as PreviewImageData[],
    activePages: state.sensenetDocumentViewer.viewer.activePages,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  rotateImages,
}

/**
 * Component that allows active page rotation
 */
export const RotateActivePagesComponent: React.FC = () => {
  const localization = useLocalization()
  const viewerState = useViewerState()

  const rotateDocumentLeft = useCallback(() => {
    // ToDo
    // props.rotateImages(viewerState.activePages, -90)
  }, [])

  const rotateDocumentRight = useCallback(() => {
    // ToDo
    // props.rotateImages(viewerState.activePages, 90)
  }, [])

  /**
   * renders the component
   */
  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        color="inherit"
        title={localization.rotateDocumentLeft}
        onClick={() => rotateDocumentLeft()}
        id="RotateActiveLeft">
        <RotateLeft />
      </IconButton>
      <IconButton
        color="inherit"
        title={localization.rotateDocumentRight}
        onClick={() => rotateDocumentRight()}
        id="RotateActiveRight">
        <RotateRight />
      </IconButton>
    </div>
  )
}
