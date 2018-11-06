import { IContent } from '@sensenet/client-core'
import { IActionModel } from '@sensenet/default-content-types'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { getContentTypeFromUrl, getExtensionFromUrl } from '../../assets/helpers'
import AddNewDialog from '../Dialogs/AddNewDialog'
import { AddNewButton } from '../Menu/AddNewButton'

const mapStateToProps = (state: rootStateType) => {
    return {
        actions: state.dms.actionmenu.addNewTypes,
        repository: state.sensenet.session.repository,
    }
}

const mapDispatchToProps = {
    getActions: DMSActions.loadTypesToAddNewList,
    closeActionMenu: DMSActions.closeActionMenu,
    openActionMenu: DMSActions.openActionMenu,
    openDialog: DMSActions.openDialog,
    closeDialog: DMSActions.closeDialog,
}

interface AddNemMenuProps {
    currentContent: IContent,
    actions: IActionModel[],
}

interface AddNemMenuState {
    addNewOptions: IActionModel[],
    currentContent: IContent,
}

class AddNewMenu extends React.Component<AddNemMenuProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, AddNemMenuState> {
    public state = {
        addNewOptions: [],
        currentContent: null,
    }
    constructor(props: AddNewMenu['props']) {
        super(props)

        this.handleButtonClick = this.handleButtonClick.bind(this)
    }
    public static getDerivedStateFromProps(newProps: AddNewMenu['props'], lastState: AddNewMenu['state']) {
        if ((newProps.currentContent && newProps.currentContent.Id && (lastState.currentContent !== newProps.currentContent)) && lastState.addNewOptions.length === 0) {
            newProps.getActions(newProps.currentContent.Id)
        }
        const optionList = []
        const folderList = []
        if (lastState.addNewOptions.length !== newProps.actions.length) {
            newProps.actions.map((action) => {
                const contentType = action.Url.includes('ContentType') ? getContentTypeFromUrl(action.Url) : null
                const extension = contentType === 'File' ? getExtensionFromUrl(action.Url) : null
                const displayName = action.DisplayName.indexOf('New') === -1 ? action.DisplayName : action.DisplayName.substring(3)
                const newDisplayName = action.DisplayName.indexOf('New') === -1 ? `New ${action.DisplayName.toLowerCase()}` : action.DisplayName
                action.DisplayName = newDisplayName
                // tslint:disable-next-line:no-string-literal
                action['Action'] = () => {
                    newProps.closeActionMenu()
                    newProps.openDialog(<AddNewDialog
                        parentPath={newProps.currentContent.Path}
                        contentTypeName={contentType}
                        extension={extension}
                        title={contentType === 'File' ? displayName : contentType.toLowerCase()} />,
                        newDisplayName, newProps.closeDialog)
                }
                if (action.DisplayName.indexOf('folder') > -1) {
                    if (action.DisplayName.indexOf('smart') === -1) {
                        folderList.push(action)
                    }
                } else {
                    optionList.push(action)
                }
            })
        }
        return {
            ...lastState,
            currentContent: newProps.currentContent,
            addNewOptions: lastState.addNewOptions.length !== newProps.actions.length ? [...optionList, ...folderList] : lastState.addNewOptions,
        }
    }
    public handleButtonClick = (e) => {
        const { addNewOptions } = this.state
        this.props.closeActionMenu()
        this.props.openActionMenu(addNewOptions, this.props.currentContent, this.props.currentContent.Id.toString(), e.currentTarget, {
            top: e.currentTarget.offsetTop + 45,
            left: e.currentTarget.offsetLeft,
        })
    }
    public render() {
        return (
            <AddNewButton
                contentType=""
                onClick={(e) => this.handleButtonClick(e)} />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewMenu)
