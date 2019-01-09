import IconButton from '@material-ui/core/IconButton'
import Save from '@material-ui/icons/Save'
import React from 'react'
import { connect } from 'react-redux'
import { DocumentData, PreviewImageData } from '../../models'
import { RootReducerType, saveChanges } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    saveChanges: state.sensenetDocumentViewer.localization.saveChanges,
    document: state.sensenetDocumentViewer.documentState.document as DocumentData,
    pages: state.sensenetDocumentViewer.previewImages.AvailableImages as PreviewImageData[],
    canEdit: state.sensenetDocumentViewer.documentState.canEdit,
    hasChanges:
      state.sensenetDocumentViewer.documentState.hasChanges || state.sensenetDocumentViewer.previewImages.hasChanges,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  save: saveChanges as (document: DocumentData, pages: PreviewImageData[]) => void,
}

/**
 * Document widget component for saving document state
 */
export class SaveDocumentComponent extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> {
  private save() {
    this.props.canEdit && this.props.save(this.props.document, this.props.pages)
  }

  /**
   * renders the component
   */
  public render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <IconButton disabled={!this.props.hasChanges || !this.props.canEdit} title={this.props.saveChanges}>
          <Save onClick={() => this.save()} />
        </IconButton>
      </div>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaveDocumentComponent)

export { connectedComponent as SaveWidget }
