import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { RepositoryContext } from '@sensenet/hooks-react'
import { Actions } from '@sensenet/redux'
import React, { Component } from 'react'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'
import { loadEditedContent } from '../../store/edited/actions'
import { rootStateType } from '../../store/rootReducer'
import { FullScreenLoader } from '../FullScreenLoader'
import DialogInfo from './DialogInfo'

interface EditPropertiesDialogProps {
  contentTypeName: string
  content: GenericContent
  repository: Repository
}

const mapStateToProps = (state: rootStateType) => {
  return {
    schemas: state.sensenet.session.repository ? state.sensenet.session.repository.schemas : [],
    editedcontent: state.dms.edited,
    items: state.dms.documentLibrary.items,
    repositoryUrl: state.sensenet.session.repository ? state.sensenet.session.repository.repositoryUrl : '',
    currentUser: state.sensenet.session.user.userName,
  }
}

const mapDispatchToProps = {
  closeDialog: DMSActions.closeDialog,
  openDialog: DMSActions.openDialog,
  editContent: Actions.updateContent,
  loadEditedContent,
  getSchema: Actions.getSchemaByTypeName,
}

interface EditPropertiesDialogState {
  editedcontent: GenericContent | undefined
}

const LoadableEditView = Loadable({
  loader: async () => (await import(/* webpackChunkName: "controls-react" */ '@sensenet/controls-react')).EditView,
  loading: FullScreenLoader,
})

class EditPropertiesDialog extends Component<
  EditPropertiesDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  EditPropertiesDialogState
> {
  public static contextType = RepositoryContext
  public state = {
    editedcontent: this.props.editedcontent ? this.props.editedcontent : undefined,
  }
  public static getDerivedStateFromProps(
    newProps: EditPropertiesDialog['props'],
    lastState: EditPropertiesDialog['state'],
  ) {
    if (
      lastState.editedcontent === null ||
      (newProps.content && (lastState.editedcontent ? lastState.editedcontent.Id !== newProps.content.Id : false))
    ) {
      const schema = newProps.repository.schemas.getSchemaByName(newProps.contentTypeName)
      const editableFields = schema.FieldSettings.filter((field) => field.VisibleEdit).map((field) => field.Name)
      editableFields.push('Icon')
      const options = {
        select: editableFields,
        metadata: 'no',
      } as ODataParams<GenericContent>
      newProps.loadEditedContent(newProps.content ? newProps.content.Id : 0, options)
    }
    return {
      editedcontent: newProps.content,
    }
  }
  public handleCancel = () => {
    this.props.closeDialog()
  }
  public submitCallback = () => {
    this.props.closeDialog()
  }
  public render() {
    const { editContent, content, repositoryUrl } = this.props
    const { editedcontent } = this.state

    return (
      <MediaQuery minDeviceWidth={700}>
        {(matches) => (
          <div data-cy="editProperties" style={matches ? { width: 550 } : {}}>
            <Typography variant="h5" gutterBottom={true}>
              {resources.EDIT_PROPERTIES}
            </Typography>
            <DialogInfo currentContent={editedcontent ? editedcontent : content} repositoryUrl={repositoryUrl} />
            {editedcontent ? (
              <RepositoryContext.Consumer>
                {(repository) => (
                  <LoadableEditView
                    content={editedcontent}
                    contentTypeName={editedcontent.Type}
                    repository={repository}
                    onSubmit={(saveableFields) => {
                      editContent(editedcontent, saveableFields)
                      this.submitCallback()
                    }}
                    handleCancel={() => this.handleCancel()}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditPropertiesDialog)
