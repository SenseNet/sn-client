import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { IODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import * as Loadable from 'react-loadable'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'
import { repository } from '../../index'
import { loadEditedContent } from '../../store/edited/actions'
import { FullScreenLoader } from '../FullScreenLoader'
import DialogInfo from './DialogInfo'

interface EditPropertiesDialogProps {
    contentTypeName: string,
    content: GenericContent | null,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        schemas: state.sensenet.session.repository ? state.sensenet.session.repository.schemas : [],
        editedcontent: state.dms.edited,
        items: state.dms.documentLibrary.items,
        repositoryUrl: state.sensenet.session.repository ? state.sensenet.session.repository.repositoryUrl : '',
    }
}

const mapDispatchToProps = {
    closeDialog: DMSActions.closeDialog,
    openDialog: DMSActions.openDialog,
    editContent: Actions.updateContent,
    loadEditedContent,
    getSchema: Actions.getSchema,
}

interface EditPropertiesDialogState {
    editedcontent: GenericContent | undefined,
}

const LoadableEditView = Loadable({
    loader: async () => {
        const module = await import(/* webpackChunkName: "controls-react" */ '@sensenet/controls-react/dist/viewcontrols/EditView')
        return module.EditView
    },
    loading: () => <FullScreenLoader />,
})

class EditPropertiesDialog extends React.Component<EditPropertiesDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, EditPropertiesDialogState> {
    public state = {
        editedcontent: this.props.editedcontent ? this.props.editedcontent : undefined,
    }
    public static getDerivedStateFromProps(newProps: EditPropertiesDialog['props'], lastState: EditPropertiesDialog['state']) {
        if (lastState.editedcontent === null || newProps.content && (lastState.editedcontent ? lastState.editedcontent.Id !== newProps.content.Id : false)) {
            const schema = repository.schemas.getSchemaByName(newProps.contentTypeName)
            const editableFields = schema.FieldSettings
                .filter((field) => field.VisibleEdit)
                .map((field) => field.Name)
            editableFields.push('Icon')
            const options = {
                select: editableFields,
                metadata: 'no',
            } as IODataParams<GenericContent>
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
        const { contentTypeName, editContent, content, repositoryUrl } = this.props
        const { editedcontent } = this.state

        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) =>
                    <div style={matches ? { width: 550 } : {}}>
                        <Typography variant="headline" gutterBottom>
                            {resources.EDIT_PROPERTIES}
                        </Typography>
                        <DialogInfo currentContent={editedcontent ? editedcontent : content} repositoryUrl={repositoryUrl} />
                        {editedcontent ?
                            <LoadableEditView
                                content={editedcontent}
                                repository={repository as Repository}
                                contentTypeName={contentTypeName}
                                onSubmit={editContent}
                                handleCancel={() => this.handleCancel()}
                                submitCallback={this.submitCallback} />
                            : <CircularProgress size={50} />}
                    </div>
                }
            </MediaQuery>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPropertiesDialog)
