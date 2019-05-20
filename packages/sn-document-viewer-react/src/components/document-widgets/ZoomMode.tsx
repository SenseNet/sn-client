import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MobileStepper from '@material-ui/core/MobileStepper'

import AspectRatio from '@material-ui/icons/AspectRatio'
import Code from '@material-ui/icons/Code'
import Error from '@material-ui/icons/Error'

import ZoomIn from '@material-ui/icons/ZoomIn'
import ZoomOut from '@material-ui/icons/ZoomOut'
import ZoomOutMap from '@material-ui/icons/ZoomOutMap'

import React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setCustomZoomLevel, setZoomMode, ZoomMode } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    zoomMode: state.sensenetDocumentViewer.viewer.zoomMode,
    customZoomLevel: state.sensenetDocumentViewer.viewer.customZoomLevel,
    localization: {
      zoomMode: state.sensenetDocumentViewer.localization.zoomMode,
      zoomModeFit: state.sensenetDocumentViewer.localization.zoomModeFit,
      zoomModeFitHeight: state.sensenetDocumentViewer.localization.zoomModeFitHeight,
      zoomModeFitWidth: state.sensenetDocumentViewer.localization.zoomModeFitWidth,
      zoomModeOriginalSize: state.sensenetDocumentViewer.localization.zoomModeOriginalSize,
      zooomModeCustom: state.sensenetDocumentViewer.localization.zooomModeCustom,
    },
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  setZoomMode,
  setZoomLevel: setCustomZoomLevel,
}

/**
 * Document widget component for modifying the zoom mode / level
 */
export class ZoomWidgetComponent extends React.Component<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps>,
  { zoomMenuAnchor?: HTMLElement }
> {
  /** the component state */
  public state = { zoomMenuAnchor: undefined }

  private openZoomMenu(event: React.MouseEvent<any>) {
    this.setState({ zoomMenuAnchor: event.currentTarget })
  }

  private closeZoomMenu(newZoomMode?: ZoomMode) {
    if (newZoomMode) {
      this.props.setZoomMode(newZoomMode)
    }
    this.setState({ zoomMenuAnchor: undefined })
  }

  private zoomIn(ev: React.MouseEvent<HTMLElement>) {
    ev.preventDefault()
    ev.stopPropagation()
    this.props.setZoomLevel(this.props.customZoomLevel + 1 || 1)
  }

  private zoomOut(ev: React.MouseEvent<HTMLElement>) {
    ev.preventDefault()
    ev.stopPropagation()
    this.props.setZoomLevel(this.props.customZoomLevel - 1 || 0)
  }

  /**
   * renders the component
   */
  public render() {
    const localization = this.props.localization
    return (
      <div style={{ display: 'inline-block' }}>
        <IconButton onClick={ev => this.openZoomMenu(ev)} title={localization.zoomMode}>
          {(() => {
            switch (this.props.zoomMode) {
              case 'custom':
                if (this.props.customZoomLevel > 0) {
                  return <ZoomIn />
                }
                return <ZoomOut />
              case 'fitHeight':
                return <Code style={{ transform: 'rotate(90deg)' }} />
              case 'fitWidth':
                return <Code />
              case 'originalSize':
                return <AspectRatio />
              case 'fit':
                return <ZoomOutMap />
              default:
                return <Error />
            }
          })()}
        </IconButton>
        <Menu
          id="zoom-menu"
          anchorEl={this.state.zoomMenuAnchor}
          open={Boolean(this.state.zoomMenuAnchor)}
          onClose={() => this.closeZoomMenu()}>
          <MenuItem onClick={() => this.closeZoomMenu('fit')}>
            <ZoomOutMap /> &nbsp; {localization.zoomModeFit}{' '}
          </MenuItem>
          <MenuItem onClick={() => this.closeZoomMenu('originalSize')}>
            <AspectRatio />
            &nbsp; {localization.zoomModeOriginalSize}{' '}
          </MenuItem>
          <MenuItem onClick={() => this.closeZoomMenu('fitHeight')}>
            <Code style={{ transform: 'rotate(90deg)' }} /> &nbsp; {localization.zoomModeFitHeight}{' '}
          </MenuItem>
          <MenuItem onClick={() => this.closeZoomMenu('fitWidth')}>
            <Code /> &nbsp; {localization.zoomModeFitWidth}{' '}
          </MenuItem>
          <Divider light={true} />
          &nbsp; {localization.zooomModeCustom} <br />
          <MobileStepper
            variant="progress"
            steps={6}
            position="static"
            activeStep={this.props.customZoomLevel}
            nextButton={
              <IconButton disabled={this.props.customZoomLevel === 5} onClickCapture={ev => this.zoomIn(ev)}>
                <ZoomIn />
              </IconButton>
            }
            backButton={
              <IconButton disabled={this.props.customZoomLevel === 0} onClickCapture={ev => this.zoomOut(ev)}>
                <ZoomOut />
              </IconButton>
            }
          />
        </Menu>
      </div>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ZoomWidgetComponent)
export { connectedComponent as ZoomModeWidget }
