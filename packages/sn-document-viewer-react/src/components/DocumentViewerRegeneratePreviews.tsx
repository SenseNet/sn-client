import Typography from '@material-ui/core/Typography'
import React = require('react')
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'
import { componentType } from '../services/TypeHelpers'
import { regeneratePreviews, RootReducerType } from '../store'
import { LayoutAppBar } from './LayoutAppBar'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
const mapStateToProps = (state: RootReducerType) => {
  return {
    regeneratePreviewsText: state.sensenetDocumentViewer.localization.regeneratePreviews,
    regenerateButton: state.sensenetDocumentViewer.localization.regenerateButton,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {
  regeneratePreviews,
}

class DocumentViewerRegeneratePreviewsComponent extends React.Component<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps>
> {
  /**
   * renders the component
   */
  public render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <LayoutAppBar style={{ position: 'fixed', top: 0 }}>
          <span />
        </LayoutAppBar>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'column',
            maxWidth: 500,
            margin: '.5em 0 .6em 0',
          }}>
          <Typography variant="subtitle1" color="textSecondary" align="center" gutterBottom>
            {this.props.regeneratePreviewsText}
          </Typography>
          <Button variant="contained" onClick={this.props.regeneratePreviews}>
            {this.props.regenerateButton}
          </Button>
        </div>
      </div>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentViewerRegeneratePreviewsComponent)

export { connectedComponent as DocumentViewerRegeneratePreviews }
