import CircularProgress from '@material-ui/core/CircularProgress'
import { RepositoryContext } from '@sensenet/hooks-react'
import { Actions, Reducers } from '@sensenet/redux'
import React, { Component } from 'react'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../../Actions'
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
  getSchema: Actions.getSchemaByTypeName,
}

const LoadableNewView = Loadable({
  loader: async () => (await import(/* webpackChunkName: "controls-react" */ '@sensenet/controls-react')).NewView,
  loading: FullScreenLoader,
})

class AddNewDialog extends Component<
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

  public render() {
    const { parentPath, contentTypeName, createContent, schema, title, extension } = this.props
    return (
      <MediaQuery minDeviceWidth={700}>
        {(matches) => (
          <div style={matches ? { width: 500 } : {}}>
            {schema ? (
              <RepositoryContext.Consumer>
                {(repository) => (
                  <LoadableNewView
                    repository={repository}
                    contentTypeName={contentTypeName}
                    handleCancel={() => this.handleCancel()}
                    onSubmit={(content) => {
                      createContent(parentPath, content as any, contentTypeName)
                      this.props.closeCallback()
                      this.props.closeDialog()
                    }}
                    showTitle={!!title}
                    extension={extension}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddNewDialog)
