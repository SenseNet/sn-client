import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import { IContent } from '@sensenet/client-core'
import { IActionModel } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { getContentTypeFromUrl, getExtensionFromUrl } from '../../assets/helpers'
import AppBarLogo from '../AppBarLogo'
import AddNewDialog from '../Dialogs/AddNewDialog'
import { QuickSearch } from '../QuickSearch'

const styles = {
    appBar: {
        background: '#4cc9f2',
        zIndex: 1210,
        boxShadow: 'none',
    },
    menuButton: {
        marginLeft: -12,
        height: 36,
    },
    plusButton: {
        height: 36,
    },
}

const mapStateToProps = (state: rootStateType) => {
    return {
        actions: state.dms.actionmenu.addNewTypes,
        menuIsOpen: state.dms.menuOpen,
        currentContent: state.dms.documentLibrary.parent,
    }
}

const mapDispatchToProps = {
    getActions: DMSActions.loadTypesToAddNewList,
    openMenu: DMSActions.handleDrawerMenu,
    closeActionMenu: DMSActions.closeActionMenu,
    openActionMenu: DMSActions.openActionMenu,
    openDialog: DMSActions.openDialog,
    closeDialog: DMSActions.closeDialog,
    uploadFileList: DMSActions.uploadFileList,
}

interface MobileHeaderProps {
    currentContent: IContent,
    actions: IActionModel[],
}

interface MobileHeaderState {
    open: boolean,
    addNewOptions: IActionModel[],
    currentContent: IContent,
}

class MobileHeader extends React.Component<MobileHeaderProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, MobileHeaderState> {
    public state = {
        open: this.props.menuIsOpen,
        addNewOptions: [],
        currentContent: null,
    }
    constructor(props) {
        super(props)

        this.handleAddNewClick = this.handleAddNewClick.bind(this)
    }
    public handleClick = () => {
        this.props.openMenu(!this.props.menuIsOpen)
        this.setState({
            open: !this.state.open,
        })
    }
    public handleAddNewClick = (e) => {
        const { addNewOptions } = this.state
        this.props.closeActionMenu()
        this.props.openActionMenu(addNewOptions, this.props.currentContent, this.props.currentContent.Id.toString(), e.currentTarget, {
            top: e.currentTarget.offsetTop + 45,
            left: e.currentTarget.offsetLeft,
        })
    }
    public static getDerivedStateFromProps(newProps: MobileHeader['props'], lastState: MobileHeader['state']) {
        if ((newProps.currentContent && newProps.currentContent.Id && (lastState.currentContent !== newProps.currentContent)) && lastState.addNewOptions.length === 0) {
            newProps.getActions(newProps.currentContent.Id)
        }
        const uploadList: Array<Partial<IActionModel>> = [{
            DisplayName: 'Upload file',
            Icon: 'file',
            Name: 'uploadFile',
        },
        {
            DisplayName: 'Upload folder',
            Icon: 'folder',
            Name: 'uploadFolder',
        }]
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
            addNewOptions: lastState.addNewOptions.length !== newProps.actions.length ? [...uploadList, ...optionList, ...folderList] : lastState.addNewOptions,
        }
    }
    public render() {
        return (
            <AppBar position="absolute" style={styles.appBar}>
                <Toolbar style={{ minHeight: 36, padding: '0px 0px 0px 10px' }}>
                    <IconButton
                        style={styles.menuButton}
                        color="inherit"
                        aria-label="Menu"
                        onClick={() => this.handleClick()}>
                        <Icon type={iconType.materialui} iconName="menu" style={{ color: '#fff' }} />
                    </IconButton>
                    <AppBarLogo />
                    <div>
                        <QuickSearch />
                        <IconButton onClick={(e) => this.handleAddNewClick(e)} style={styles.plusButton} color="inherit" aria-label="Add new">
                            <Icon type={iconType.materialui} iconName="add" style={{ color: '#fff' }} />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileHeader)
