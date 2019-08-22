import Typography from '@material-ui/core/Typography'
import React = require('react')
import { connect } from 'react-redux'
import { componentType } from '../services/TypeHelpers'
import { RootReducerType } from '../store'
import { LayoutAppBar } from './LayoutAppBar'

interface DocumentViewerLoadingProps {
  image: string
}

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
const mapStateToProps = (state: RootReducerType) => {
  return {
    loadingDocument: state.sensenetDocumentViewer.localization.loadingDocument,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {}

export const DocumentViewerLoadingComponent: React.FC<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps, DocumentViewerLoadingProps>
> = props => {
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
        <img src={props.image} />
        <Typography variant="h5" color="textSecondary" align="center" style={{ fontWeight: 'bolder' }}>
          {props.loadingDocument}
        </Typography>
      </div>
    </div>
  )
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentViewerLoadingComponent)

export { connectedComponent as DocumentViewerLoading }
