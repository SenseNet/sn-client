import CircularProgress from '@material-ui/core/CircularProgress'
import { Actions, Reducers } from '@sensenet/redux'
import React from 'react'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../../Actions'
import { RepositoryContext } from '../../context/RepositoryContext'
import { rootStateType } from '../../store/rootReducer'
import { FullScreenLoader } from '../FullScreenLoader'

interface AddNewDialogProps {
  parentPath: string
  contentTypeName: string
  extension?: string
  title?: string
}

interface AddNewDialogState {
  ctype: string
}

const mapStateToProps = (state: rootStateType) => {
  return {
    schema: Reducers.getSchema(state.sensenet),
    closeCallback: state.dms.dialog.onClose,
  }
}

const mapDispatchToProps = {
  closeDialog: DMSActions.closeDialog,
  createContent: Actions.createContent,
  getSchema: Actions.getSchema,
}

const LoadableNewView = Loadable({
  loader: async () =>
    (await import(/* webpackChunkName: "controls-react" */ '@sensenet/controls-react/dist/viewcontrols/NewView'))
      .NewView,
  loading: FullScreenLoader,
})

class AddNewDialog extends React.Component<
  AddNewDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  AddNewDialogState
> {
  public state = {
    ctype: '',
  }
  public static getDerivedStateFromProps(newProps: AddNewDialog['props'], lastState: AddNewDialog['state']) {
    if (lastState.ctype !== newProps.contentTypeName && newProps.contentTypeName) {
      newProps.getSchema(newProps.contentTypeName)
    }
    return {
      ctype: newProps.contentTypeName,
    }
  }
  public handleCancel = () => {
    this.props.closeDialog()
  }
  public submitCallback = () => {
    this.props.closeCallback()
    this.props.closeDialog()
  }
  public render() {
    const { parentPath, contentTypeName, createContent, schema, title, extension } = this.props

    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => (
          <div style={matches ? { width: 500 } : {}}>
            {schema ? (
              <RepositoryContext.Consumer>
                {repository => (
                  <LoadableNewView
                    path={parentPath}
                    repository={repository}
                    contentTypeName={contentTypeName}
                    handleCancel={() => this.handleCancel()}
                    onSubmit={createContent}
                    title={title}
                    extension={extension}
                    submitCallback={this.submitCallback}
                  />
                )}
              </RepositoryContext.Consumer>
            ) : (
              <CircularProgress size={50} />
            )}
          </div>
        )}
      </MediaQuery>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddNewDialog)
