import IconButton from '@material-ui/core/IconButton'
import Print from '@material-ui/icons/Print'
import React from 'react'
import { connect } from 'react-redux'
import { DocumentData } from '../../models'
import { componentType } from '../../services'
import { RootReducerType } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    title: state.sensenetDocumentViewer.localization.print,
    document: state.sensenetDocumentViewer.documentState.document,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {}

/**
 * Own properties for the Share component
 */
export interface OwnProps {
  print: (document: DocumentData) => void
}

/**
 * Component that allows active page rotation
 */
export class PrintComponent extends React.Component<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>
> {
  /**
   * renders the component
   */
  public render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <IconButton
          color="inherit"
          title={this.props.title}
          onClick={() => this.props.print(this.props.document)}
          id="Print">
          <Print />
        </IconButton>
      </div>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrintComponent)

export { connectedComponent as Print }
