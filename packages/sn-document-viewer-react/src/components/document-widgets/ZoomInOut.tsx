import IconButton from '@material-ui/core/IconButton'
import ZoomIn from '@material-ui/icons/ZoomIn'
import ZoomOut from '@material-ui/icons/ZoomOut'
import * as React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setFitRelativeZoomLevel } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    fitRelativeZoomLevel: state.sensenetDocumentViewer.viewer.fitRelativeZoomLevel,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  setFitRelativeZoomLevel,
}

/**
 * Document widget component for modifying the zoom mode / level
 */
export class ZoomInOutWidgetComponent extends React.Component<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps>,
  { zoomMenuAnchor?: HTMLElement }
> {
  private zoomIn(ev: React.MouseEvent<HTMLElement>) {
    this.props.setFitRelativeZoomLevel(this.props.fitRelativeZoomLevel + 1)
  }

  private zoomOut(ev: React.MouseEvent<HTMLElement>) {
    this.props.setFitRelativeZoomLevel(this.props.fitRelativeZoomLevel - 1)
  }

  /**
   * renders the component
   */
  public render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <IconButton color="inherit" onClick={ev => this.zoomIn(ev)}>
          <ZoomIn />
        </IconButton>
        <IconButton color="inherit" onClick={ev => this.zoomOut(ev)}>
          <ZoomOut />
        </IconButton>
      </div>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ZoomInOutWidgetComponent)
export { connectedComponent as ZoomInOutWidget }
